using System;
using System.Threading.Tasks;
using HtmlAgilityPack;

namespace Rubybooru.IqdbApi.Parsers
{
    public abstract class AbstractParser : IParser
    {
        public abstract Task<ParseResult> Parse(Uri url);

        protected static Task<HtmlDocument> CreateDoc(Uri url)
        {
            var task = Task.Run(() =>
            {
                var web = new HtmlWeb();
                var doc = web.Load(url.ToString());
                return doc;
            });
            return task;
        }
    }
}