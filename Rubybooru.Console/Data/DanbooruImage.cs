using System.Collections.Generic;

namespace Rubybooru.Console.Data
{
    public class DanbooruImage
    {
        public int Id { get; set; }
        public IList<DanbooruTag> Tags { get; set; }
    }
}