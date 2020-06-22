using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class ZerochanParser : AbstractParser
    {
        private const string ImageLinkSelector = "//a[@class='preview']";
        private const string TagSelector = "//*[@id=\"tags\"]//li";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);
            var image = GetImage(url, doc);
            var tags = GetTags(doc);

            return new ParseResult(tags, image, null);
        }

        private List<Tag> GetTags(HtmlDocument doc)
        {
            var result = new List<Tag>();
            var tags = doc.DocumentNode.SelectNodes(TagSelector);
            foreach (var tag in tags)
            {
                var links = tag.Descendants("a");
                if (!links.Any())
                {
                    continue;
                }

                result.Add(new Tag(GetTagType(tag), links.First().InnerText));
            }

            return result;
        }

        private static TagType GetTagType(HtmlNode element)
        {
            var text = element.GetDirectInnerText().Trim().ToLower();
            switch (text)
            {
                case "studio":
                    return TagType.Studio;
                case "visual novel":
                case "series":
                case "game":
                    return TagType.Copyright;
                case "character":
                    return TagType.Character;
                case "mangaka":
                    return TagType.Artist;
                case "source":
                default:
                    return TagType.General;
            }
        }

        private static Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var link = doc.DocumentNode.SelectNodes(ImageLinkSelector).First();
            return new Uri(baseUrl, link.GetAttributeValue("href", ""));
        }
    }
}