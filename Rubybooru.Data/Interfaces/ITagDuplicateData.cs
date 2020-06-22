using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface ITagDuplicateData
    {
        IEnumerable<TagDuplicate> GetAll(TagType? tagType = null);

        TagDuplicate Get(string name, TagType? tagType = null);

        TagDuplicate GetById(int id);
        
        TagDuplicate Add(TagDuplicate tagDuplicate);
        
        TagDuplicate Update(TagDuplicate tagDuplicate);
        
        TagDuplicate Delete(int id);

        int Commit();
    }
}