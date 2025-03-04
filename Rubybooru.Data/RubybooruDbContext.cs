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
        public DbSet<TagDuplicate> TagDuplicate { get; set; }
        public DbSet<ImagePreview> ImagePreviews { get; set; }
        public DbSet<BlackWhiteImage> BlackWhiteImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ImageTag>().HasKey(i => new { i.ImageId, i.TagId });
            modelBuilder.Entity<ImagePreview>().HasKey(i => new { i.ImageId, i.Width, i.Height, i.KeepAspectRatio });
            modelBuilder.Entity<BlackWhiteImage>().HasKey(b => b.ImageId);
            modelBuilder.Entity<ImagePreview>()
                .HasOne(ip => ip.Image)
                .WithMany(i => i.ImagePreviews)
                .HasForeignKey(ip => ip.ImageId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<BlackWhiteImage>()
                .HasOne(bw => bw.Image)
                .WithMany(i => i.BlackWhiteImages)
                .HasForeignKey(bw => bw.ImageId)
                .OnDelete(DeleteBehavior.Cascade);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}