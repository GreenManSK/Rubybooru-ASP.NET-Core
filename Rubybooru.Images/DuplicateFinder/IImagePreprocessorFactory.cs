namespace Rubybooru.Images.DuplicateFinder
{
    public interface IImagePreprocessorFactory
    {
        public ImagePreprocessor Create(string imagePath);
    }
}