using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlImageTagData : IImageTagData
    {
        private readonly RubybooruDbContext _db;

        public SqlImageTagData(RubybooruDbContext db)
        {
            _db = db;
        }

        public ImageTag Get(int imageId, int tagId)
        {
            return _db.ImageTag.Find(imageId, tagId);
        }
        
        public ImageTag Add(ImageTag tag)
        {
            _db.Add(tag);
            return tag;
        }

        public ImageTag Update(ImageTag tag)
        {
            var entity = _db.ImageTag.Attach(tag);
            entity.State = EntityState.Modified;
            return tag;
        }

        public ImageTag Delete(int id)
        {
            var tag = _db.ImageTag.Find(id);

            if (tag != null)
            {
                _db.ImageTag.Remove(tag);
            }

            return tag;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}