using System;
using System.Threading.Tasks;

namespace Rubybooru.IqdbApi.Parsers
{
    public interface IParser
    {
        Task<ParseResult> Parse(Uri url);
    }
}