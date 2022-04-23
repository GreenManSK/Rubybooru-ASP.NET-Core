using System;
using SixLabors.ImageSharp;

namespace Rubybooru.Images
{
    public class ImageInfo : IImageInfo
    {
        public Tuple<int, int> GetImageResolution(string path)
        {
            using var image = Image.Load(path);
            return new Tuple<int, int>(image.Width, image.Height);
        }
    }
}