namespace Rubybooru.Core
{
    public class DuplicateRecord
    {
        public int Id { get; set; }
        
        public int ImageAId { get; set; }
        public virtual Image ImageA { get; set; }
        
        public int ImageBId { get; set; }
        public virtual Image ImageB { get; set; }
    }
}