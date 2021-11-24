using System.Linq;
using System.Net;

namespace Rubybooru.Helpers
{
    public static class PathHelper
    {
        public static string PrepareUrl(string text)
        {
            return string.Join(
                "/",
                text.Split("/").Select(s => WebUtility.UrlEncode(s))
            );
        }
    }
}