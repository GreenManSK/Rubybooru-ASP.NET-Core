using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public abstract class MoebooruParser : AbstractParser
    {
        protected const string TagContainerId = "tag-sidebar";
        private const string StatsContainerId = "stats";
        private const string ImageLinkOriginalClass = "original-file-unchanged";
        private const string ImageLinkChangedClass = "original-file-changed";

        private const string SourceText = "Source";

        public override async Task<ParseResult> Parse(Uri url)
        {
            var doc = await CreateDoc(url);
            var image = GetImage(url, doc);
            var source = GetSource(url, doc);
            var tags = GetTags(doc);

            return new ParseResult(tags, image, source);
        }

        protected abstract List<Tag> GetTags(HtmlDocument doc);

        protected Uri GetImage(Uri baseUrl, HtmlDocument doc)
        {
            var original = doc.DocumentNode.SelectNodes($"//a[@class='{ImageLinkOriginalClass}']");
            var link = original != null && original.Any()
                ? original.First()
                : doc.DocumentNode.SelectNodes($"//a[@class='{ImageLinkChangedClass}']").First();
            return new Uri(baseUrl, link.GetAttributeValue("href", ""));
        }

        protected Uri GetSource(Uri baseUrl, HtmlDocument doc)
        {
            var infoRows = doc.GetElementbyId(StatsContainerId).Descendants("li");
            foreach (var row in infoRows)
            {
                if (row.InnerText.Contains(SourceText) && row.Descendants("a").Any())
                {
                    return new Uri(baseUrl, row.Descendants("a").First().GetAttributeValue("href", ""));
                }
            }

            return null;
        }
    }
}