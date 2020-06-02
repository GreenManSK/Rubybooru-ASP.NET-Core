namespace Rubybooru.Core
{
    public class ImageTag
    {
        public int ImageId { get; set; }
        public Image Image { get; set; }

        public int TagId { get; set; }
        public Tag Tag { get; set; }

        public bool UserCreated { get; set; }
    }
}