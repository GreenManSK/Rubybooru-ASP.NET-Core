using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class SankakuChannelParser : AbstractParser
    {
        private const string ImageLinkSelector = "//*[@id=\"stats\"]//li[contains(text(),\"Original:\")]//a";
        private const string TagSelector = "//*[@id=\"tag-sidebar\"]//li";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);
            var image = GetImage(url, doc);
            var tags = GetTags(doc);

            return new ParseResult(tags, image, null);
        }

        private static List<Tag> GetTags(HtmlDocument doc)
        {
            var result = new List<Tag>();
            var tags = doc.DocumentNode.SelectNodes(TagSelector);
            foreach (var tag in tags)
            {
                result.Add(new Tag(
                    GetTagType(tag.GetAttributeValue("class", "")),
                    tag.Descendants("a").First().InnerText
                ));
            }

            return result;
        }

        private static TagType GetTagType(string tagClass)
        {
            return tagClass switch
            {
                "tag-type-artist" => TagType.Artist,
                "tag-type-character" => TagType.Character,
                "tag-type-copyright" => TagType.Copyright,
                "tag-type-medium" => TagType.Medium,
                "tag-type-meta" => TagType.Meta,
                "tag-type-studio" => TagType.Studio,
                _ => TagType.General
            };
        }

        private static Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var link = doc.DocumentNode.SelectSingleNode(ImageLinkSelector);
            return link != null ? new Uri(baseUrl, link.GetAttributeValue("href", "")) : null;
        }
    }
}