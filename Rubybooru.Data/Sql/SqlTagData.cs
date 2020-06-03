using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlTagData : ITagData
    {
        private readonly RubybooruDbContext _db;

        public SqlTagData(RubybooruDbContext db)
        {
            _db = db;
        }

        public IEnumerable<Tag> GetAll(
            int limit,
            int offset,
            TagSortOrder sortOrder = TagSortOrder.Name,
            TagType? tagType = null
        )
        {
            var query = from t in _db.Tags select t;
            if (tagType.HasValue)
            {
                query = query.Where(t => t.Type == tagType);
            }

            query = OrderTags(query, sortOrder);

            return query.Skip(offset).Take(limit);
        }

        private static IQueryable<Tag> OrderTags(IQueryable<Tag> query, TagSortOrder sortOrder)
        {
            return sortOrder switch
            {
                TagSortOrder.Name => query.OrderBy(t => t.Name),
                TagSortOrder.ImageCount => query.OrderByDescending(t => t.Images.Count),
                _ => query
            };
        }

        public Tag GetById(int id)
        {
            return _db.Tags.Find(id);
        }

        public Tag Add(Tag tag)
        {
            _db.Add(tag);
            return tag;
        }

        public Tag Update(Tag tag)
        {
            var entity = _db.Tags.Attach(tag);
            entity.State = EntityState.Modified;
            return tag;
        }

        public Tag Delete(int id)
        {
            var tag = GetById(id);

            if (tag != null)
            {
                _db.Tags.Remove(tag);
            }

            return tag;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}