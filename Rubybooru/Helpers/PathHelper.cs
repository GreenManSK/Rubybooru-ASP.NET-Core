using System;
using System.Linq;

namespace Rubybooru.Helpers
{
    public static class PathHelper
    {
        public static string PrepareUrl(string text)
        {
            return string.Join(
                "/",
                text.Split("/").Select(s => Uri.EscapeDataString(s))
            );
        }
    }
}