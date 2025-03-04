namespace Rubybooru.Core
{
    public class ImagePreview
    {
        public int ImageId { get; set; }
        public virtual Image Image { get; set; }

        public byte[] PreviewData { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public bool KeepAspectRatio { get; set; }
    }
}