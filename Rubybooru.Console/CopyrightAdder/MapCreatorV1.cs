using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Rubybooru.Console.Data;

namespace Rubybooru.Console.CopyrightAdder
{
    public static class MapCreatorV1
    {
        private const int CopyrightCategory = 3;
        private const int CharacterCategory = 4;

        public static int Create(string rawData, string mapFile, double pLimit)
        {
            if (!Directory.Exists(rawData))
            {
                System.Console.Error.WriteLine("Raw data path do not exists or is not a directory");
                return -1;
            }

            if (File.Exists(mapFile))
            {
                File.Delete(mapFile);
            }

            var counting = new Dictionary<string, Dictionary<string, int>>(); // character => copyright => count

            foreach (var filePath in Directory.EnumerateFiles(rawData, "*", SearchOption.AllDirectories))
            {
                ParseDataFile(filePath, counting);
            }

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
            var image = JsonConvert.DeserializeObject<DanbooruImage>(line);
            var copyrights = new HashSet<string>();
            var characters = new HashSet<string>();
            foreach (var tag in image.Tags)
            {
                switch (tag.Category)
                {
                    case CharacterCategory:
                        characters.Add(tag.Name);
                        break;
                    case CopyrightCategory:
                        copyrights.Add(tag.Name);
                        break;
                }
            }

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