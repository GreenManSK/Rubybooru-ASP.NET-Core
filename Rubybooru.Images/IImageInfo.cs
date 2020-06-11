using System;

namespace Rubybooru.Images
{
    public interface IImageInfo
    {
        Tuple<int, int> GetImageResolution(string path);
    }
}