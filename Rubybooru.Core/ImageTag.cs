namespace Rubybooru.Core
{
    public class ImageTag : HasTagProperty
    {
        public int ImageId { get; set; }
        public virtual Image Image { get; set; }

        public int TagId { get; set; }
        public virtual Tag Tag { get; set; }

        public bool UserCreated { get; set; }

        public ImageTag()
        {
        }

        public ImageTag(Image image, Tag tag)
        {
            ImageId = image.Id;
            Image = image;
            TagId = tag.Id;
            Tag = tag;
            UserCreated = true;
        }
    }
}