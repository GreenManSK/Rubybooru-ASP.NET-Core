using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IImageData
    {
        IEnumerable<Image> GetAll(
            int limit,
            int offset,
            int[] withTags = null,
            ISizeCondition[] sizeConditions = null
        );

        IEnumerable<Image> GetWithoutTagType(
            int limit,
            int offset,
            TagType tagType
        );

        Dictionary<int, ImageTag[]> GetTags(IEnumerable<int> imageIds);

        Image GetById(int id);

        Image Add(Image image);

        Image Update(Image image);

        Image Delete(int id);

        int Commit();
    }
}