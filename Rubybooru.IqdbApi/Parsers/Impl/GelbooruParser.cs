using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class GelbooruParser : AbstractParser
    {
        private const string SourceSelector = "//li[contains(text(),\"Source:\")]";
        private const string ImageLinkSelector = "//a[contains(text(),\"Original image\")]";
        private const string TagSelector = "//li[contains(@class, 'tag-type-')]";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);
            var image = GetImage(url, doc);
            var source = GetSource(url, doc);
            var tags = GetTags(doc);

            return new ParseResult(tags, image, source);
        }

        private List<Tag> GetTags(HtmlDocument doc)
        {
            var result = new List<Tag>();
            var tags = doc.DocumentNode.SelectNodes(TagSelector);
            foreach (var tag in tags)
            {
                result.Add(new Tag(
                    GetTagType(tag.GetAttributeValue("class", "")),
                    tag.Descendants("a").ElementAt(1).InnerText
                ));
            }

            return result;
        }

        private static TagType GetTagType(string tagClass)
        {
            return tagClass switch
            {
                "tag-type-copyright" => TagType.Copyright,
                "tag-type-character" => TagType.Character,
                "tag-type-artist" => TagType.Artist,
                "tag-type-metadata" => TagType.Meta,
                _ => TagType.General
            };
        }

        private static Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var link = doc.DocumentNode.SelectNodes(ImageLinkSelector).First();
            return new Uri(baseUrl, link.GetAttributeValue("href", ""));
        }

        private static Uri GetSource(Uri baseUrl, HtmlDocument doc)
        {
            var elements = doc.DocumentNode.SelectNodes(SourceSelector);
            if (elements == null || !elements.Any())
            {
                return null;
            }

            return new Uri(baseUrl, elements.First().Descendants("a").First().GetAttributeValue("href", ""));
        }
    }
}