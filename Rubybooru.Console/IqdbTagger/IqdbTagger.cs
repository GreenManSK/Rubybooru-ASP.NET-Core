using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Rubybooru.Console.Options;
using Rubybooru.Console.Runners;
using Rubybooru.Core;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.IqdbApi.Api;
using Rubybooru.IqdbApi.Parsers;
using Rubybooru.IqdbApi.Parsers.Impl;
using Tag = Rubybooru.Core.Tag;
using TagType = Rubybooru.Core.TagType;

namespace Rubybooru.Console.IqdbTagger
{
    public class IqdbTagger
    {
        private const string IqdbTagName = "iqdb";
        private const int LoggingPeriodInMs = 60 * 1000;

        private static readonly IqdbApi.Api.Options Options = new IqdbApi.Api.Options(new HashSet<ServiceType>()
        {
            ServiceType.Danbooru,
            ServiceType.Konachan,
            ServiceType.YandeRe,
            ServiceType.Gelbooru
        }, false);

        private readonly RubybooruDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly ITagData _tagData;
        private readonly ITagDuplicateData _tagDuplicateData;

        private int _imageCount = 0;
        private int _finishedCount = 0;

        private Tag _iqdbTag;
        private readonly ConcurrentQueue<Task> _imageTasks = new ConcurrentQueue<Task>();
        private readonly MatchRanker _matchRanker;
        private readonly string _imagesPath;
        private readonly DynamicParser _parser = new DynamicParser();

        private Dictionary<TagType, Dictionary<string, Tag>> _tags;

        public IqdbTagger(RubybooruDbContext db, IConfiguration configuration, ITagData tagData,
            ITagDuplicateData tagDuplicateData)
        {
            _db = db;
            _configuration = configuration;
            _tagData = tagData;
            _tagDuplicateData = tagDuplicateData;

            _imagesPath = _configuration.GetValue<string>("ImagesPath");
            _matchRanker = new MatchRanker(_configuration.GetValue<int>("IqdbMinSimilarity"), Options.Services);
        }

        public int Run(IqdbTaggerOptions options)
        {
            var images = GetImages();
            _iqdbTag = GetIqdbTag();
            _tags = GetTags();
            _imageCount = images.Count();

            var cancellationToken = new CancellationToken();
            StartConsoleLogger(LoggingPeriodInMs, cancellationToken);

            DownloadImageData(images).Wait(cancellationToken);

            return 0;
        }

        private async Task DownloadImageData(List<Image> images)
        {
            using var iqdbApi = new IqdbApi.Api.IqdbApi();
            var delay = _configuration.GetValue<int>("IqdbRequestDelayInMs");
            var now = DateTime.Now;
            foreach (var image in images)
            {
                if (image.Tags.Any(t => t.Tag == _iqdbTag))
                {
                    Interlocked.Increment(ref _finishedCount);
                    continue;
                }

                image.IqdbCheckDateTime = now;
                await DownloadImage(image, iqdbApi);
                if (image != images.LastOrDefault())
                {
                    await Task.Delay(delay);
                }
            }

            while (_imageTasks.Any())
            {
                if (_imageTasks.TryDequeue(out var task))
                {
                    await task;
                }
            }

            System.Console.WriteLine("Saving changes to database");
            await _db.SaveChangesAsync();
        }

        private async Task DownloadImage(Image image, IqdbApi.Api.IqdbApi iqdbApi)
        {
            try
            {
                List<Match> matches = await iqdbApi.SearchFile(GetImagePath(image), Options);
                _imageTasks.Enqueue(ProcessMatches(image, matches));
            }
            catch (Exception e)
            {
                System.Console.Error.WriteLine($"Error while getting iqdb data for {image.Id}");
                Interlocked.Increment(ref _finishedCount);
            }
        }

        private async Task ProcessMatches(Image image, IReadOnlyCollection<Match> matches)
        {
            var bests = matches != null ? _matchRanker.OrderBest(matches) : Enumerable.Empty<Match>();
            foreach (var best in bests)
            {
                ParseResult result = null;
                lock (ServiceType.GetTypeByUrl(best.Url))
                {
                    try
                    {
                        var parseTask = _parser.Parse(best.Url);
                        parseTask.Wait();
                        result = parseTask.Result;
                    }
                    catch (Exception e)
                    {
                        System.Console.Error.WriteLine($"Error while parsing data for {image.Id} from {best.Url}");
                    }
                }

                if (result != null)
                {
                    AddImageTags(result, image);
                    break;
                }
            }

            Interlocked.Increment(ref _finishedCount);
        }

        private void AddImageTags(ParseResult result, Image image)
        {
            foreach (var tag in result.Tags)
            {
                if (tag.Type == IqdbApi.Parsers.TagType.Character || tag.Type == IqdbApi.Parsers.TagType.Copyright)
                {
                    var type = tag.Type == IqdbApi.Parsers.TagType.Copyright ? TagType.Copyright : TagType.Character;
                    var name = tag.Value.ToLower();
                    if (!_tags[type].ContainsKey(name))
                    {
                        var dbTag = new Tag()
                        {
                            Type = type,
                            Name = name
                        };
                        _db.Add(dbTag);
                        _tags[type].Add(name, dbTag);
                    }

                    image.Tags.Add(new ImageTag()
                    {
                        Tag = _tags[type][name]
                    });
                }
            }

            if (image.Tags.All(t => t.Tag != _iqdbTag))
            {
                image.Tags.Add(new ImageTag()
                {
                    Tag = _iqdbTag
                });
            }
        }

        private async void StartConsoleLogger(int period, CancellationToken cancellationToken)
        {
            do
            {
                System.Console.WriteLine($"Images finished {_finishedCount}/{_imageCount}");
                await Task.Delay(period, cancellationToken).ConfigureAwait(false);
                cancellationToken.ThrowIfCancellationRequested();
            } while (true);
        }

        private Dictionary<TagType, Dictionary<string, Tag>> GetTags()
        {
            var result = new Dictionary<TagType, Dictionary<string, Tag>>
            {
                {TagType.Copyright, GetDbTags(TagType.Copyright)},
                {TagType.Character, GetDbTags(TagType.Character)}
            };

            return result;
        }

        private Dictionary<string, Tag> GetDbTags(TagType tagType)
        {
            var dbTags = _tagData.GetAll(0, 0, tagType: tagType).ToDictionary(t => t.Tag.Name, t => t.Tag);
            var duplicateTags = _tagDuplicateData.GetAll(tagType).ToDictionary(t => t.Name, t => t.TargetTag);
            return duplicateTags.Concat(dbTags).ToDictionary(x => x.Key, x => x.Value);
        }

        private Tag GetIqdbTag()
        {
            var tag = (from t in _db.Tags where t.Name.Equals(IqdbTagName) && t.Type == TagType.System select t)
                .FirstOrDefault();
            if (tag == null)
            {
                tag = new Tag()
                {
                    Name = IqdbTagName,
                    Type = TagType.System
                };
                _db.Add(tag);
            }

            return tag;
        }

        private List<Image> GetImages()
        {
            var validDate = DateTime.Now.AddDays(-1 * _configuration.GetValue<int>("IqdbCheckIntervalInDays"));
            var query = from i in _db.Images
                where i.Tags.All(t => t.Tag.Type != TagType.Copyright)
                      && (!i.IqdbCheckDateTime.HasValue || i.IqdbCheckDateTime.Value.CompareTo(validDate) <= 0)
                select i;

            return query.ToList();
        }

        private string GetImagePath(Image image)
        {
            return Path.Combine(_imagesPath, image.Path, image.Name);
        }
    }
}