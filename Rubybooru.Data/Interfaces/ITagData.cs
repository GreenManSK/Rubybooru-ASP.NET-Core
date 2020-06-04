using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface ITagData
    {
        IEnumerable<TagWithCount> GetAll(
            int limit,
            int offset,
            TagSortOrder sortOrder = TagSortOrder.Name,
            TagType? tagType = null,
            bool includeCount = false
        );

        Tag GetById(int id);

        Tag Add(Tag tag);

        Tag Update(Tag tag);

        Tag Delete(int id);

        int Commit();
    }
}