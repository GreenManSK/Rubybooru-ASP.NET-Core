using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Rubybooru.Console.Data;

namespace Rubybooru.Console.CopyrightAdder
{
    /**
    * Works by using one file named posts.json that has one json per line for each post.
    * Each post needs to have tag_string_character and tag_string_copyright with space separated tags.
    */
    public static class MapCreatorV2
    {
        private const int CopyrightCategory = 3;
        private const int CharacterCategory = 4;

        public static int Create(string rawData, string mapFile, double pLimit)
        {
            var postFile = rawData + "/posts.json";
            if (!File.Exists(postFile))
            {
                System.Console.Error.WriteLine("posts.json file do not exists in provided raw path");
                return -1;
            }

            if (File.Exists(mapFile))
            {
                File.Delete(mapFile);
            }

            var counting = new Dictionary<string, Dictionary<string, int>>(); // character => copyright => count

            ParseDataFile(postFile, counting);

            System.Console.WriteLine("Calculating map");
            var finalMap = CreateFinalMap(pLimit, counting);

            System.Console.WriteLine("Saving results");
            var json = JsonConvert.SerializeObject(finalMap, Formatting.None);
            File.WriteAllText(mapFile, json);

            return 0;
        }

        private static Dictionary<string, List<string>> CreateFinalMap(double pLimit, Dictionary<string, Dictionary<string, int>> counting)
        {
            var finalMap = new Dictionary<string, List<string>>();
            foreach (var (character, copyrights) in counting)
            {
                var filteredCopyright = copyrights.Where(c => c.Value > 1).ToList();
                if (filteredCopyright.Count == 0)
                    continue;
                var list = new List<string>();
                finalMap.Add(character, list);
                var allCount = (double)filteredCopyright.Sum(c => c.Value);
                var added = false;
                foreach (var (tag, count) in filteredCopyright)
                {
                    if (count / allCount >= pLimit)
                    {
                        list.Add(tag);
                        added = true;
                    }
                }

                if (!added)
                {
                    var best = filteredCopyright.OrderByDescending(v => v.Value).First();
                    list.Add(best.Key);
                }
            }

            return finalMap;
        }

        private static void ParseDataFile(string filePath, IDictionary<string, Dictionary<string, int>> counting)
        {
            try
            {
                System.Console.WriteLine($"Parsing {filePath}");
                using var file = new StreamReader(filePath);
                string line;
                while ((line = file.ReadLine()) != null)
                {
                    ParseDataFileLine(line, counting);
                }
            }
            catch (Exception e)
            {
                System.Console.Error.WriteLine($"Error while parsing {filePath}: {e}");
            }
        }

        private static void ParseDataFileLine(string line, IDictionary<string, Dictionary<string, int>> counting)
        {
            var image = JsonConvert.DeserializeObject<DanbooruDatasetImage>(line);
            var copyrights = image.Copyrights.Split(' ');
            var characters = image.Characters.Split(' ');


            foreach (var copyright in copyrights)
            {
                foreach (var character in characters)
                {
                    AddToCount(counting, copyright, character);
                }
            }
        }

        private static void AddToCount(IDictionary<string, Dictionary<string, int>> counting, string copyright,
            string character)
        {
            if (!counting.ContainsKey(character))
            {
                counting.Add(character, new Dictionary<string, int>());
            }

            var characterCounting = counting[character];
            if (!characterCounting.ContainsKey(copyright))
            {
                characterCounting[copyright] = 1;
            }
            else
            {
                characterCounting[copyright] += 1;
            }
        }
    }
}