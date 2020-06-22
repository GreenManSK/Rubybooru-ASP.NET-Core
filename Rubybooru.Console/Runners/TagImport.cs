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
        private readonly ITagDuplicateData _tagDuplicateData;

        public TagImport(ITagData tagData, ITagDuplicateData tagDuplicateData)
        {
            _tagData = tagData;
            _tagDuplicateData = tagDuplicateData;
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

        private Dictionary<TagType, IEnumerable<string>> GetDbTagLists()
        {
            var result = new Dictionary<TagType, IEnumerable<string>>
            {
                {TagType.General, GetDbTagList(TagType.General)},
                {TagType.System, GetDbTagList(TagType.System)},
                {TagType.Character, GetDbTagList(TagType.Character)}
            };

            return result;
        }

        private IEnumerable<string> GetDbTagList(TagType tagType)
        {
            var dbTags = _tagData.GetAll(0, 0, tagType: tagType).Select(t => t.Tag.Name);
            var duplicateTags = _tagDuplicateData.GetAll(tagType).Select(t => t.Name);
            return duplicateTags.Concat(dbTags);
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
            Dictionary<TagType, IEnumerable<string>> dbTags
        )
        {
            foreach (var (key, value) in dbTags)
            {
                var newList = newTags[key];
                foreach (var tag in value)
                {
                    newList.Remove(tag);
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