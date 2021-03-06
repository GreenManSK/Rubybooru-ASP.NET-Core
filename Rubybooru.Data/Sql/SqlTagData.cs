using System;
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

        public IEnumerable<TagWithCount> GetAll(
            int limit,
            int offset,
            TagSortOrder sortOrder = TagSortOrder.Name,
            TagType? tagType = null,
            bool includeCount = false
        )
        {
            var query = from t in _db.Tags select new TagWithCount
            {
                Tag = t,
                Count = sortOrder == TagSortOrder.ImageCount || includeCount ? t.Images.Count : -1
            };
            if (tagType.HasValue)
            {
                query = query.Where(t => t.Tag.Type == tagType);
            }

            query = OrderTags(query, sortOrder);
            if (limit != 0)
            {
                query = query.Skip(offset).Take(limit);
            }

            return query;
        }

        private static IQueryable<TagWithCount> OrderTags(IQueryable<TagWithCount> query, TagSortOrder sortOrder)
        {
            return sortOrder switch
            {
                TagSortOrder.Name => query.OrderBy(t => t.Tag.Name),
                TagSortOrder.ImageCount => query.OrderByDescending(t => t.Count),
                _ => query
            };
        }

        public Tag GetById(int id)
        {
            return _db.Tags.Find(id);
        }

        public Tag GetByTypeAndName(TagType type, string name)
        {
            return (from t in _db.Tags
                where t.Name.Equals(name) && t.Type == type
                select t).FirstOrDefault();
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

        public IEnumerable<Tag> GetTagsByNames(string[] names)
        {
            var lowerNames = names.Select(n => n.ToLowerInvariant());
            var query = from t in _db.Tags
                where lowerNames.Contains(t.Name.ToLower())
                select t;
            return query;
        }
    }
}