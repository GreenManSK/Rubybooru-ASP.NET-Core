namespace Rubybooru.Images
{
    public interface IPreviewMaker
    {
        void CreatePreview(string imagePath, string previewPath, int width, int height, bool keepAspectRatio, int quality);
    }
}