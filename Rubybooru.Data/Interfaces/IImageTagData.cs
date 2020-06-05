using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IImageTagData
    {
        ImageTag Get(int imageId, int tagId);

        ImageTag Add(ImageTag tag);

        ImageTag Update(ImageTag tag);

        ImageTag Delete(int id);

        int Commit();
    }
}