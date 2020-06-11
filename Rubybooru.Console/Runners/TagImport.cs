using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Rubybooru.Console.Options;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Console.Runners
{
    public class TagImport
    {
        private const string GeneralFile = "tags-general.txt";
        private const string CharacterFile = "tags-character.txt";
        private const string AllFile = "tags.txt";

        private ITagData _tagData;

        public TagImport(ITagData tagData)
        {
            _tagData = tagData;
        }

        public int Run(ImportTagsOptions options)
        {
            var path = options.Path;
            if (!FilesExists(path))
            {
                System.Console.Error.WriteLine("Not all tag files are present in provided path.");
                return -1;
            }

            var newTags = BuildTagLists(path);
            var dbTags = GetDbTagLists();
            TrimNewTags(newTags, dbTags);
            AddToDb(newTags);
            return 0;
        }

        private void AddToDb(Dictionary<TagType, HashSet<string>> newTags)
        {
            foreach (var (type, tags) in newTags)
            {
                foreach (var tag in tags)
                {
                    var tagEntity = new Tag()
                    {
                        Type = type,
                        Name = tag
                    };
                    _tagData.Add(tagEntity);
                }
            }

            _tagData.Commit();
        }

        private Dictionary<TagType, IEnumerable<Tag>> GetDbTagLists()
        {
            var result = new Dictionary<TagType, IEnumerable<Tag>>
            {
                {TagType.General, _tagData.GetAll(0, 0, tagType: TagType.General).Select(t => t.Tag)},
                {TagType.System, _tagData.GetAll(0, 0, tagType: TagType.System).Select(t => t.Tag)},
                {TagType.Character, _tagData.GetAll(0, 0, tagType: TagType.Character).Select(t => t.Tag)}
            };

            return result;
        }

        private static Dictionary<TagType, HashSet<string>> BuildTagLists(string path)
        {
            var result = new Dictionary<TagType, HashSet<string>>
            {
                {TagType.General, new HashSet<string>(GetTags(Path.Combine(path, GeneralFile)))},
                {TagType.Character, new HashSet<string>(GetTags(Path.Combine(path, CharacterFile)))}
            };

            var systemTags = new HashSet<string>();
            var allTags = GetTags(Path.Combine(path, AllFile));
            foreach (var tag in allTags)
            {
                if (!result[TagType.General].Contains(tag) && !result[TagType.Character].Contains(tag))
                {
                    systemTags.Add(tag);
                }
            }

            result.Add(TagType.System, systemTags);

            return result;
        }

        private static void TrimNewTags(
            IReadOnlyDictionary<TagType, HashSet<string>> newTags,
            Dictionary<TagType, IEnumerable<Tag>> dbTags
        )
        {
            foreach (var (key, value) in dbTags)
            {
                var newList = newTags[key];
                foreach (var tag in value)
                {
                    newList.Remove(tag.Name);
                }
            }
        }

        private static IEnumerable<string> GetTags(string path)
        {
            return File.ReadAllLines(path);
        }

        private static bool FilesExists(string path)
        {
            return File.Exists(Path.Combine(path, GeneralFile)) &&
                   File.Exists(Path.Combine(path, CharacterFile)) &&
                   File.Exists(Path.Combine(path, AllFile));
        }
    }
}