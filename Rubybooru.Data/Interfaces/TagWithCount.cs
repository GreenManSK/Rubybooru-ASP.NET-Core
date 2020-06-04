using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public class TagWithCount : HasTagProperty
    {
        public Tag Tag { get; set; }
        public int Count { get; set; }
    }
}