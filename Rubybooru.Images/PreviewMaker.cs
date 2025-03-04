using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;
using System.IO;

namespace Rubybooru.Images
{
    public class PreviewMaker : IPreviewMaker
    {
        public byte[] CreatePreview(string imagePath, int width, int height, bool keepAspectRatio, int quality)
        {
            var jpegEncoder = new JpegEncoder { Quality = quality };
            var resizeOptions = new ResizeOptions
            {
                Size = new Size(width, height),
                Mode = keepAspectRatio ? ResizeMode.Max : ResizeMode.Crop
            };

            using var image = Image.Load(imagePath);
            image.Mutate(img => img.Resize(resizeOptions));

            using var ms = new MemoryStream();
            image.SaveAsJpeg(ms, jpegEncoder);
            return ms.ToArray();
        }
    }
}