using ImageProcessor.Configuration;
using ImageProcessor.Plugins.WebP.Imaging.Formats;

namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessorFactory : IImagePreprocessorFactory
    {
        public ImagePreprocessorFactory()
        {
            ImageProcessorBootstrapper.Instance.AddImageFormats(new WebPFormat());
        }

        public ImagePreprocessor Create(string imagePath)
        {
            return new ImagePreprocessor(imagePath);
        }
    }
}