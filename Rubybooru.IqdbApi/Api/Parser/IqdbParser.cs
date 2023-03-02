using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Api.Parser
{
    public class IqdbParser
    {
        private const string ContainerId = "pages";

        // Number of tr rows in valid match HTML div
        private const int ValidRowCount = 5;

        private const int ImageRow = 1;
        private const int ServiceRow = 2;
        private const int SizeRow = 3;
        private const int SimilarityRow = 4;

        private const string NoMatchText = "No relevant matches";

        private const string SimilarityRegex = @"(\d+)";
        private const string WidthRegex = @"(\d+)×";
        private const string HeightRegex = @"×(\d+)";

        public static List<Match> ParseHtml(Uri baseUrl, string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var result = new List<Match>();

            var pageContainer = doc.GetElementbyId(ContainerId);
            if (pageContainer == null || html.Contains(NoMatchText))
            {
                return result;
            }

            var matches = pageContainer.Elements("div");
            foreach (var match in matches)
            {
                var rowsDescendants = match.Descendants("tr");
                var rows = rowsDescendants as HtmlNode[] ?? rowsDescendants.ToArray();
                if (rows.Length != ValidRowCount || !match.Descendants("img").Any())
                {
                    continue;
                }

                var similarity = int.Parse(Extract(rows.ElementAt(SimilarityRow).InnerText, SimilarityRegex));
                int.TryParse(Extract(rows.ElementAt(SizeRow).InnerText, WidthRegex), out var width);
                int.TryParse(Extract(rows.ElementAt(SizeRow).InnerText, HeightRegex), out var height);

                var url = new Uri(baseUrl,
                    rows.ElementAt(ImageRow).Descendants("a").First().GetAttributeValue("href", ""));
                var type = ServiceType.GetTypeByUrl(url);

                result.Add(new Match(similarity, width, height, type, url));

                var relativeServices = rows.ElementAt(ServiceRow).Descendants("a");
                if (relativeServices.Any())
                {
                    foreach (var relativeService in relativeServices)
                    {
                        var relativeUrl = new Uri(baseUrl, relativeService.GetAttributeValue("href", ""));
                        var relativeType = ServiceType.GetTypeByUrl(relativeUrl);
                        if (relativeType != type)
                        {
                            result.Add(new Match(similarity, width, height, relativeType, relativeUrl));
                        }
                    }
                }
            }

            result.Sort();
            result.Reverse();
            return result;
        }

        private static string Extract(string text, string pattern)
        {
            var matches = Regex.Match(text, pattern);
            return !matches.Success ? "" : matches.Groups[1].Value;
        }
    }
}