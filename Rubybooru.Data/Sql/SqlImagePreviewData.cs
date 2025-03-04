using System.Linq;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlImagePreviewData : IImagePreviewData
    {
        private readonly RubybooruDbContext _db;

        public SqlImagePreviewData(RubybooruDbContext db)
        {
            _db = db;
        }

        public ImagePreview Get(int imageId, int width, int height, bool keepAspectRatio)
        {
            return _db.ImagePreviews.FirstOrDefault(p => p.ImageId == imageId && p.Width == width && p.Height == height && p.KeepAspectRatio == keepAspectRatio);
        }

        public ImagePreview Add(ImagePreview preview)
        {
            var entity = _db.ImagePreviews.Add(preview);
            return entity.Entity;
        }

        public ImagePreview Delete(int imageId, int width, int height, bool keepAspectRatio)
        {
            var preview = Get(imageId, width, height, keepAspectRatio);
            if (preview != null)
            {
                _db.ImagePreviews.Remove(preview);
            }
            return preview;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}