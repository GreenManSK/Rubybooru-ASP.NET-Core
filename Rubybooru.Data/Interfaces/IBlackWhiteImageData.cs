using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IBlackWhiteImageData
    {
        BlackWhiteImage Get(int imageId);
        BlackWhiteImage Add(BlackWhiteImage blackWhiteImage);
        BlackWhiteImage Delete(int imageId);
        int Commit();
    }
}