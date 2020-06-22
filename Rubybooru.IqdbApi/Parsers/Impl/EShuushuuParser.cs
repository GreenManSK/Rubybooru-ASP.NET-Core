using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class EShuushuuParser : AbstractParser
    {
        private const string ImageLinkClass = "thumb_image";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);

            var image = GetImage(url, doc);
            var tags = new List<Tag>();
            tags.AddRange(GetTags(doc, "Tags", TagType.General));
            tags.AddRange(GetTags(doc, "Source", TagType.Copyright));
            tags.AddRange(GetTags(doc, "Characters", TagType.Character));
            tags.AddRange(GetTags(doc, "Artist", TagType.Artist));

            return new ParseResult(tags, image, null);
        }

        private static IEnumerable<Tag> GetTags(HtmlDocument doc, string name, TagType type)
        {
            var tagContainer = doc.DocumentNode.SelectNodes($"//dt[contains(text(),\"{name}\")]");
            if (tagContainer == null || !tagContainer.Any())
                return new List<Tag>();
            var sibling = tagContainer.First().NextSibling;
            while (sibling is HtmlTextNode)
            {
                sibling = sibling.NextSibling;
            }

            return sibling.Descendants("a").Select(e => new Tag(type, e.InnerText));
        }

        private static Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var link = doc.DocumentNode.SelectNodes($"//a[@class='{ImageLinkClass}']");
            return link.Any() ? new Uri(baseUrl, link.First().GetAttributeValue("href", "")) : null;
        }
    }
}