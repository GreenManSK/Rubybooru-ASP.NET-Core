using System;
using System.Collections.Generic;

namespace Rubybooru.Core
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public DateTime AddedDateTime { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int Size { get; set; }

        public virtual List<ImageTag> Tags { get; set; } = new List<ImageTag>();
    }
}