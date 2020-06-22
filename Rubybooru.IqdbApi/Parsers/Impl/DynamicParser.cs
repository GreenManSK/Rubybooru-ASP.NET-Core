using System;
using System.Threading.Tasks;
using Rubybooru.IqdbApi.Api;

namespace Rubybooru.IqdbApi.Parsers.Impl
{
    public class DynamicParser : IParser
    {
        public Task<ParseResult> Parse(Uri url)
        {
            var type = ServiceType.GetTypeByUrl(url);
            IParser innerParser;

            if (type == ServiceType.Danbooru)
            {
                innerParser = new DanbooruParser();
            }
            else if (type == ServiceType.Konachan)
            {
                innerParser = new KonachanParser();
            }
            else if (type == ServiceType.YandeRe)
            {
                innerParser = new YandeReParser();
            }
            else if (type == ServiceType.Gelbooru)
            {
                innerParser = new GelbooruParser();
            }
            else if (type == ServiceType.SankakuChannel)
            {
                innerParser = new SankakuChannelParser();
            }
            else if (type == ServiceType.EShuushuu)
            {
                innerParser = new EShuushuuParser();
            }
            else if (type == ServiceType.Zerochan)
            {
                innerParser = new ZerochanParser();
            }
            else
            {
                throw new ArgumentOutOfRangeException($"{type.Domain} is not supported right now");
            }

            return innerParser.Parse(url);
        }
    }
}