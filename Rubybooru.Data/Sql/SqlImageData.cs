using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlImageData : IImageData
    {
        private readonly RubybooruDbContext _db;

        public SqlImageData(RubybooruDbContext db)
        {
            _db = db;
        }

        public IEnumerable<Image> GetAll(int limit, int offset, int[] withTags = null,
            ISizeCondition[] sizeConditions = null)
        {
            var query = from i in _db.Images select i;

            if (withTags != null)
            {
                query = query.Where(i => i.Tags.Any(t => withTags.Contains(t.TagId)));
            }

            if (sizeConditions != null)
            {
                foreach (var condition in sizeConditions)
                {
                    query = condition.Apply(query);
                }
            }

            query = LoadTags(query);
            
            return query.OrderByDescending(i => i.AddedDateTime).Skip(offset).Take(limit);
        }

        private static IQueryable<Image> LoadTags(IQueryable<Image> query)
        {
            query = query
                .Include(i => i.Tags)
                .ThenInclude(t => t.Tag);
            return query;
        }

        public IEnumerable<Image> GetWithoutTagType(int limit, int offset, TagType tagType)
        {
            var query = from i in _db.Images
                where i.Tags.All(t => t.Tag.Type != tagType)
                orderby i.AddedDateTime descending
                select i;
            return query.Skip(offset).Take(limit);
        }

        public Image GetById(int id)
        {
            return _db.Images.Find(id);
        }

        public Image Add(Image image)
        {
            _db.Add(image);
            return image;
        }

        public Image Update(Image image)
        {
            var entity = _db.Images.Attach(image);
            entity.State = EntityState.Modified;
            return image;
        }

        public Image Delete(int id)
        {
            var image = GetById(id);

            if (image != null)
            {
                _db.Images.Remove(image);
            }

            return image;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}