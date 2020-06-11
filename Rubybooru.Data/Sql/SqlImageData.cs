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
            var query = Filter(withTags, sizeConditions);

            return query.OrderByDescending(i => i.AddedDateTime).Skip(offset).Take(limit);
        }

        public int CountImages(int[] withTags = null, ISizeCondition[] sizeConditions = null)
        {
            var query = Filter(withTags, sizeConditions);
            return query.Count();
        }

        private IQueryable<Image> Filter(int[] withTags, ISizeCondition[] sizeConditions)
        {
            var query = from i in _db.Images select i;

            if (withTags != null && withTags.Length > 0)
            {
                foreach (var tagId in withTags)
                {
                    query = query.Where(i => i.Tags.Any(t => t.TagId == tagId));
                }
            }

            if (sizeConditions != null)
            {
                foreach (var condition in sizeConditions)
                {
                    query = condition.Apply(query);
                }
            }

            return query;
        }

        public IEnumerable<Image> GetWithoutTagType(int limit, int offset, TagType tagType)
        {
            var query = QueryWithoutTagType(tagType);
            return query.OrderByDescending(i => i.AddedDateTime).Skip(offset).Take(limit);
        }

        public int CountWithoutTagType(TagType tagType)
        {
            var query = QueryWithoutTagType(tagType);
            return query.Count();
        }

        private IQueryable<Image> QueryWithoutTagType(TagType tagType)
        {
            var query = from i in _db.Images
                where i.Tags.All(t => t.Tag.Type != tagType)
                select i;
            return query;
        }

        public Image GetById(int id)
        {
            return _db.Images.Find(id);
        }

        public Image GetByFullPath(string path, string name)
        {
            var query = from i in _db.Images
                where i.Name.Equals(name) && i.Path.Equals(path)
                select i;
            return query.FirstOrDefault();
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

        public Dictionary<int, ImageTag[]> GetTags(IEnumerable<int> imageIds)
        {
            var query = from it in _db.ImageTag
                where imageIds.Contains(it.ImageId)
                select it;
            query = query.Include(it => it.Tag);
            var imageTagPairs = query.ToList();
            return imageTagPairs
                .GroupBy(it => it.ImageId)
                .ToDictionary(g => g.Key, g => g.ToArray());
        }
    }
}