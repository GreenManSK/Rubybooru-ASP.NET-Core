using System;
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
        private readonly Random _random;

        public SqlImageData(RubybooruDbContext db)
        {
            _db = db;
            _random = new Random();
        }

        public IEnumerable<Image> GetAll(int limit, int offset, int[] withTags = null,
            ISizeCondition[] sizeConditions = null)
        {
            var query = Filter(withTags, sizeConditions);

            return query
                .OrderByDescending(i => i.AddedDateTime)
                .ThenByDescending(i => i.Id)
                .Skip(offset)
                .Take(limit);
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

        public IEnumerable<Image> GetWithoutTagType(int limit, int offset, TagType tagType, int? year = null)
        {
            var query = QueryWithoutTagType(tagType, year);
            return query
                .OrderBy(i => i.AddedDateTime)
                .ThenByDescending(i => i.Id)
                .Skip(offset)
                .Take(limit);
        }

        public int CountWithoutTagType(TagType tagType, int? year = null)
        {
            var query = QueryWithoutTagType(tagType, year);
            return query.Count();
        }

        public IEnumerable<int> GetYearsWithoutTagType(TagType tagType)
        {
            var query = QueryWithoutTagType(tagType);
            return query.Select(i => i.AddedDateTime.Year).Distinct().OrderBy(i => i);
        }

        private IQueryable<Image> QueryWithoutTagType(TagType tagType, int? year = null)
        {
            var query = from i in _db.Images
                where i.Tags.All(t => t.Tag.Type != tagType)
                select i;
            if (year != null)
            {
                query = query.Where(i => i.AddedDateTime.Year == year);
            }
            return query;
        }

        public IEnumerable<Image> GetWithoutDuplicateCheck(int limit, int offset)
        {
            var query = from i in _db.Images
                where !i.DuplicateCheck
                orderby i.Id
                select i;
            return query.Skip(offset).Take(limit);
        }

        public int CountWithoutDuplicateCheck()
        {
            var query = from i in _db.Images
                where !i.DuplicateCheck
                select i;
            return query.Count();
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

        public void MergeTags(Image target, Image source)
        {
            var targetTags = target.Tags.Select(t => t.TagId).ToHashSet();
            foreach (var tag in source.Tags)
            {
                if (!targetTags.Contains(tag.TagId))
                {
                    target.Tags.Add(new ImageTag()
                    {
                        ImageId = target.Id,
                        TagId = tag.TagId
                    });
                }
            }
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

        public int GetRandomId()
        {
            var image = _db.Images.FromSqlRaw("SELECT * FROM Images ORDER BY RANDOM() LIMIT 1").FirstOrDefault();
            return image?.Id ?? 0;
        }

        public int GetRandomFilteredId(int[] withTags = null, ISizeCondition[] sizeConditions = null)
        {
            var query = Filter(withTags, sizeConditions).Select(x => x.Id);
            
            var length = query.Count();
            var pick = _random.Next(0, length - 1);

            var imageId = query.Skip(pick).Take(1).FirstOrDefault();
            return imageId;
        }
    }
}