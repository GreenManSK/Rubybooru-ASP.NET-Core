using System;
using System.IO;
using ImageProcessor;
using ImageProcessor.Configuration;
using ImageProcessor.Plugins.WebP.Imaging.Formats;

namespace Rubybooru.Images
{
    public class ImageInfo : IImageInfo
    {
        public ImageInfo()
        {
            ImageProcessorBootstrapper.Instance.AddImageFormats(new WebPFormat());
        }

        public Tuple<int, int> GetImageResolution(string path)
        {
            var imageBytes = File.ReadAllBytes(path);

            using var inStream = new MemoryStream(imageBytes);
            using var imageFactory = new ImageFactory();
            imageFactory.Load(inStream);
            var image = imageFactory.Image;
            return new Tuple<int, int>(image.Width, image.Height);
        }
    }
}