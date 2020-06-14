using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;

namespace Rubybooru.Data
{
    public class RubybooruDbContext : DbContext
    {
        public RubybooruDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Image> Images { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ImageTag> ImageTag { get; set; }
        public DbSet<DuplicateRecord> DuplicateRecord { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ImageTag>().HasKey(i => new {i.ImageId, i.TagId});
            base.OnModelCreating(modelBuilder);
        }
    }
}