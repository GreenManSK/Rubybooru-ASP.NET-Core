namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessorFactory : IImagePreprocessorFactory
    {
        public ImagePreprocessor Create(string imagePath)
        {
            return new ImagePreprocessor(imagePath);
        }
    }
}