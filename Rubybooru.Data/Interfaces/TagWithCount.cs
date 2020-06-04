using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public class TagWithCount
    {
        public Tag Tag { get; set; }
        public int Count { get; set; }
    }
}