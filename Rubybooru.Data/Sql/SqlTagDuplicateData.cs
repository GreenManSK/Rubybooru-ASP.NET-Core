using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlTagDuplicateData : ITagDuplicateData
    {
        private readonly RubybooruDbContext _db;

        public SqlTagDuplicateData(RubybooruDbContext db)
        {
            _db = db;
        }

        public IEnumerable<TagDuplicate> GetAll()
        {
            var query = from t in _db.TagDuplicate select t;
            query.Include(t => t.TargetTag);
            return query;
        }

        public TagDuplicate Get(string name, TagType? tagType = null)
        {
            var query = from t in _db.TagDuplicate select t;

            query = query.Where(t => t.Name.Equals(name));

            if (tagType.HasValue)
            {
                query = query.Where(t => t.TargetTag.Type == tagType.Value);
            }
            
            return query.FirstOrDefault();
        }

        public TagDuplicate GetById(int id)
        {
            return _db.TagDuplicate.Find(id);
        }

        public TagDuplicate Add(TagDuplicate tagDuplicate)
        {
            _db.Add(tagDuplicate);
            return tagDuplicate;
        }

        public TagDuplicate Update(TagDuplicate tagDuplicate)
        {
            var entity = _db.TagDuplicate.Attach(tagDuplicate);
            entity.State = EntityState.Modified;
            return tagDuplicate;
        }

        public TagDuplicate Delete(int id)
        {
            var tagDuplicate = GetById(id);

            if (tagDuplicate != null)
            {
                _db.TagDuplicate.Remove(tagDuplicate);
            }

            return tagDuplicate;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}