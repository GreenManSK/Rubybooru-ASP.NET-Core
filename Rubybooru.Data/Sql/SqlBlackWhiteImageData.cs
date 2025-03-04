using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using System.Linq;

namespace Rubybooru.Data.Sql
{
    public class SqlBlackWhiteImageData : IBlackWhiteImageData
    {
        private readonly RubybooruDbContext db;

        public SqlBlackWhiteImageData(RubybooruDbContext db)
        {
            this.db = db;
        }

        public BlackWhiteImage Get(int imageId)
        {
            return db.BlackWhiteImages.Find(imageId);
        }

        public BlackWhiteImage Add(BlackWhiteImage blackWhiteImage)
        {
            db.BlackWhiteImages.Add(blackWhiteImage);
            return blackWhiteImage;
        }

        public BlackWhiteImage Delete(int imageId)
        {
            var blackWhiteImage = Get(imageId);
            if (blackWhiteImage != null)
            {
                db.BlackWhiteImages.Remove(blackWhiteImage);
            }
            return blackWhiteImage;
        }

        public int Commit()
        {
            return db.SaveChanges();
        }
    }
}