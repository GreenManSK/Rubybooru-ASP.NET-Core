using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Rubybooru.Images
{
    public class PreviewMaker : IPreviewMaker
    {
        public void CreatePreview(string imagePath, string previewPath, int width, int height, bool keepAspectRatio,
            int quality)
        {
            var jpegEncoder = new JpegEncoder {Quality = quality};
            var resizeOptions = new ResizeOptions
            {
                Size = new Size(width, height), Mode = keepAspectRatio ? ResizeMode.Max : ResizeMode.Crop
            };

            using var image = Image.Load(imagePath);
            image.Mutate(img => img.Resize(resizeOptions));
            image.SaveAsJpeg(previewPath, jpegEncoder);
        }
    }
}