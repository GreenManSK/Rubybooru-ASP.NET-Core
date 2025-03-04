using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IImagePreviewData
    {
        ImagePreview Get(int imageId, int width, int height, bool keepAspectRatio);
        ImagePreview Add(ImagePreview preview);
        ImagePreview Delete(int imageId, int width, int height, bool keepAspectRatio);
        int Commit();
    }
}