using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IImageData
    {
        IEnumerable<Image> GetAll(
            int limit,
            int offset,
            int[] withTags,
            ISizeCondition[] sizeConditions
        );

        IEnumerable<Image> GetWithoutTagType(
            int limit,
            int offset,
            TagType tagType
        );

        Image GetById(int id);

        Image Add(Image tag);

        Image Update(Image tag);

        Image Delete(int id);

        int Commit();
    }
}