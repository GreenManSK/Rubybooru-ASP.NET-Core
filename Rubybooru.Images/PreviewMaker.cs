using System.Drawing;
using System.IO;
using ImageProcessor;
using ImageProcessor.Configuration;
using ImageProcessor.Imaging;
using ImageProcessor.Imaging.Formats;
using ImageProcessor.Plugins.WebP.Imaging.Formats;

namespace Rubybooru.Images
{
    public class PreviewMaker : IPreviewMaker
    {
        public PreviewMaker()
        {
            ImageProcessorBootstrapper.Instance.AddImageFormats( new WebPFormat());
        }

        public void CreatePreview(string imagePath, string previewPath, int width, int height, bool keepAspectRatio,
            int quality)
        {
            var imageBytes = File.ReadAllBytes(imagePath);
            var format = new JpegFormat {Quality = quality};

            using var inStream = new MemoryStream(imageBytes);
            using var outStream = File.Create(previewPath);
            using var imageFactory = new ImageFactory();

            var size = new Size(width, height);
            var resizeLayer = new ResizeLayer(size, keepAspectRatio ? ResizeMode.Max : ResizeMode.Crop);

            imageFactory.Load(inStream)
                .Resize(resizeLayer)
                .Format(format)
                .Save(outStream);
        }
    }
}