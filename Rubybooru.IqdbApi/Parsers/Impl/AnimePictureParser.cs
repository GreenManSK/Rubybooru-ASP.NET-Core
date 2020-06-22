using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class AnimePictureParser : AbstractParser
    {
        private const string ImageLinkClass = "download_icon";
        private const string TagContainerId = "post_tags";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);

            var image = GetImage(url, doc);
            var tags = new List<Tag>();
            tags.AddRange(GetTags(doc, "", TagType.General));
            tags.AddRange(GetTags(doc, "green", TagType.Copyright));
            tags.AddRange(GetTags(doc, "orange", TagType.Artist));
            tags.AddRange(GetTags(doc, "blue", TagType.Character));

            return new ParseResult(tags, image, null);
        }

        private static IEnumerable<Tag> GetTags(HtmlDocument doc, string className, TagType type)
        {
            var lis = doc.GetElementbyId(TagContainerId).SelectNodes($"//li[@class='{className}']");
            var result = new List<Tag>();
            if (lis == null)
                return result;
            result.AddRange(lis.Select(li => new Tag(type, li.Descendants("a").First().InnerText)));
            return result;
        }

        private static Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var link = doc.DocumentNode.SelectNodes($"a[@class='{ImageLinkClass}']").First();
            return link != null ? new Uri(baseUrl, link.GetAttributeValue("href", "")) : null;
        }
    }
}