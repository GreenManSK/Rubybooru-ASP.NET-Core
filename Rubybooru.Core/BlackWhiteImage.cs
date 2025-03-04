namespace Rubybooru.Core
{
    public class BlackWhiteImage
    {
        public int ImageId { get; set; }
        public virtual Image Image { get; set; }
        public byte[] ImageData { get; set; }
    }
}