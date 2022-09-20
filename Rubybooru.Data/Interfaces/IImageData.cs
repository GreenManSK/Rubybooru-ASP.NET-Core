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

        int CountImages(
            int[] withTags = null,
            ISizeCondition[] sizeConditions = null
        );

        IEnumerable<Image> GetWithoutTagType(
            int limit,
            int offset,
            TagType tagType
        );

        int CountWithoutTagType(TagType tagType);

        IEnumerable<Image> GetWithoutDuplicateCheck(int limit, int offset);

        int CountWithoutDuplicateCheck();
        
        Dictionary<int, ImageTag[]> GetTags(IEnumerable<int> imageIds);

        Image GetById(int id);

        Image GetByFullPath(string path, string name);

        int GetRandomId();
        
        int GetRandomFilteredId(
            int[] withTags = null,
            ISizeCondition[] sizeConditions = null
        );
        void MergeTags(Image target, Image source);
        
        Image Add(Image image);

        Image Update(Image image);

        Image Delete(int id);

        int Commit();
    }
}