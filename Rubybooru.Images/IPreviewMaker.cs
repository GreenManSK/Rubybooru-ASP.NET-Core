namespace Rubybooru.Images
{
    public interface IPreviewMaker
    {
        byte[] CreatePreview(string imagePath, int width, int height, bool keepAspectRatio, int quality);
    }
}