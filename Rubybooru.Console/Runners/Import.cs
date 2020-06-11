using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;
using Rubybooru.Console.Options;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using Rubybooru.Images;

namespace Rubybooru.Console.Runners
{
    public class Import
    {
        private const string ImageLineStart = "Tags of ";

        private readonly IConfiguration _configuration;
        private readonly ITagData _tagData;
        private readonly IImageData _imageData;
        private readonly IImageInfo _imageInfo;

        private int _parsedImages = 0;

        public Import(IConfiguration configuration, ITagData tagData, IImageData imageData, IImageInfo imageInfo)
        {
            _configuration = configuration;
            _tagData = tagData;
            _imageData = imageData;
            _imageInfo = imageInfo;
        }

        public int Run(ImportOptions options)
        {
            if (!File.Exists(options.ResultsFile))
            {
                System.Console.Error.WriteLine("Result file dose not exists");
                return -1;
            }

            var root = options.PathRoot ?? _configuration["ImagesPath"];
            var tags = GetTagMap();

            try
            {
                _parsedImages = 0;
                AddImages(options.ResultsFile, root, tags);
            }
            catch (Exception ex)
            {
                System.Console.Error.WriteLine($"Error while parsing result file {ex}");
                return -1;
            }
            
            System.Console.WriteLine("Commiting images");
            _imageData.Commit();

            return 0;
        }

        private void AddImages(string path, string root, Dictionary<string, int> tags)
        {
            using var file = new StreamReader(path);
            string line;
            while ((line = file.ReadLine()) != null)
            {
                if (line.StartsWith(ImageLineStart))
                {
                    var fullPath = GetFullPath(line);
                    var (filePath, fileName) = GetPathAndFileName(fullPath, root);
                    AddImage(fullPath, filePath, fileName, file, tags);
                    _parsedImages++;
                    if (_parsedImages % 100 == 0)
                    {
                        System.Console.WriteLine($"Parsed {_parsedImages} images");
                    }
                }
            }
        }

        private void AddImage(string fullPath, string path, string name, TextReader file,
            IReadOnlyDictionary<string, int> tags)
        {
            if (ImageExists(path, name))
            {
                return;
            }

            var (width, height) = _imageInfo.GetImageResolution(fullPath);
            var image = new Image()
            {
                Name = name,
                Path = path,
                AddedDateTime = File.GetCreationTime(fullPath),
                Width = width,
                Height = height,
                Size = new FileInfo(fullPath).Length
            };

            for (var line = file.ReadLine(); !string.IsNullOrWhiteSpace(line); line = file.ReadLine())
            {
                var tagName = GetTagName(line);
                if (tags.ContainsKey(tagName))
                {
                    image.Tags.Add(new ImageTag()
                    {
                        TagId = tags[tagName]
                    });
                }
            }

            _imageData.Add(image);
        }

        private bool ImageExists(string path, string name)
        {
            return _imageData.GetByFullPath(path, name) != null;
        }

        private Dictionary<string, int> GetTagMap()
        {
            return _tagData.GetAll(0, 0).ToDictionary(t => t.Tag.Name, t => t.Tag.Id);
        }

        private static Tuple<string, string> GetPathAndFileName(string fullPath, string root)
        {
            var path = fullPath.Replace(root, "");
            return new Tuple<string, string>(
                Path.GetDirectoryName(path).TrimStart('/', '\\'),
                Path.GetFileName(path)
            );
        }

        private static string GetFullPath(string line)
        {
            return Regex.Replace(line, $"(^{ImageLineStart}|:$)", "");
        }

        private static string GetTagName(string line)
        {
            return Regex.Replace(line, @"^\(.*?\)", "").Trim();
        }
    }
}