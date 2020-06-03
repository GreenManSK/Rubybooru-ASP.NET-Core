using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IImageTagData
    {
        ImageTag Add(ImageTag tag);

        ImageTag Update(ImageTag tag);

        ImageTag Delete(int id);

        int Commit();
    }
}