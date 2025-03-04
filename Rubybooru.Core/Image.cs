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
        public double SideRatio { get; set; }
        public long Size { get; set; }
        public bool DuplicateCheck { get; set; }
        public DateTime? IqdbCheckDateTime { get; set; }

        public virtual List<ImageTag> Tags { get; set; } = new List<ImageTag>();
        public virtual List<ImagePreview> ImagePreviews { get; set; } = new List<ImagePreview>();
        public virtual List<BlackWhiteImage> BlackWhiteImages { get; set; } = new List<BlackWhiteImage>();

        public string GetSafePath()
        {
            return Path.Replace('\\', '/');
        }
    }
}