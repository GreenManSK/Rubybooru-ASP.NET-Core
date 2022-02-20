using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Rubybooru.Core;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Console.CopyrightAdder
{
    public class Adder
    {
        private readonly RubybooruDbContext _db;
        private readonly ITagData _tagData;
        private readonly ITagDuplicateData _tagDuplicateData;

        public Adder(RubybooruDbContext db, ITagData tagData, ITagDuplicateData tagDuplicateData)
        {
            _db = db;
            _tagData = tagData;
            _tagDuplicateData = tagDuplicateData;
        }

        public int AddByCharacter(string mapFile, int startId, int endId)
        {
            var map = GetMap(mapFile);
            var copyrightTags = GetCopyrightTags();
            var images = GetImages(startId, endId).ToList();

            System.Console.WriteLine("Adding tags");
            foreach (var image in images)
            {
                var characters = GetCharacters(image).ToList();
                if (characters.Any())
                {
                    AddCopyrights(image, characters, map, copyrightTags);
                }
            }

            System.Console.WriteLine("Saving data");
            _db.SaveChanges();

            return 0;
        }

        public int AddByFilterTag(int filterTagId, int copyrightTagId, int startId, int endId)
        {
            var copyrightTag = _tagData.GetById(copyrightTagId);
            if (copyrightTag == null)
            {
                System.Console.Error.WriteLine("Copyright tag not found");
                return -1;
            }

            var images = GetImages(startId, endId)
                .Where(i => i.Tags.Any(t => t.TagId == filterTagId))
                .Where(i => i.Tags.All(t => t.Tag.Type != TagType.Character));

            System.Console.WriteLine("Adding tags");
            foreach (var image in images)
            {
                image.Tags.Add(new ImageTag()
                {
                    Tag = copyrightTag
                });
            }

            System.Console.WriteLine("Saving data");
            _db.SaveChanges();
            return 0;
        }

        private void AddCopyrights(Image image, List<string> characters, Dictionary<string, List<string>> map,
            IDictionary<string, Tag> copyrightTags)
        {
            var copyrights = GetCharacterCopyrights(characters, map);
            foreach (var copyright in copyrights)
            {
                if (!copyrightTags.ContainsKey(copyright))
                {
                    var tag = new Tag()
                    {
                        Name = copyright,
                        Type = TagType.Copyright,
                        UserCreated = true
                    };
                    _tagData.Add(tag);
                    copyrightTags.Add(copyright, tag);
                }

                image.Tags.Add(new ImageTag()
                {
                    Tag = copyrightTags[copyright]
                });
            }
        }

        private static HashSet<string> GetCharacterCopyrights(List<string> characters,
            Dictionary<string, List<string>> map)
        {
            var result = new HashSet<string>();
            foreach (var character in characters)
            {
                if (map.ContainsKey(character))
                {
                    map[character].ForEach(c => result.Add(c));
                }
            }

            return result;
        }

        private IEnumerable<Image> GetImages(int startId, int endId)
        {
            var result = from i in _db.Images select i;
            result = result.Where(i => i.Tags.All(t => t.Tag.Type != TagType.Copyright));
            result = result.Where(i => i.Id >= startId);
            if (endId != -1)
            {
                result = result.Where(i => i.Id <= endId);
            }

            return result;
        }

        private Dictionary<string, Tag> GetCopyrightTags()
        {
            var dbTags = _tagData.GetAll(0, 0, TagSortOrder.Name, TagType.Copyright)
                .GroupBy(t => t.Tag.Name)
                .ToDictionary(t => t.First().Tag.Name, t => t.First().Tag);
            var duplicateTags = _tagDuplicateData.GetAll(TagType.Copyright)
                .GroupBy(t => t.TargetTag.Name)
                .ToDictionary(t => t.First().TargetTag.Name, t => t.First().TargetTag);
            return duplicateTags.Concat(dbTags).GroupBy(x => x.Key)
                .ToDictionary(x => x.First().Key, x => x.First().Value);
        }

        private static IEnumerable<string> GetCharacters(Image image)
        {
            return image.Tags.Where(it => it.Tag.Type == TagType.Character).Select(it => it.Tag.Name);
        }

        private static Dictionary<string, List<string>> GetMap(string mapFile)
        {
            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(File.ReadAllText(mapFile));
        }
    }
}