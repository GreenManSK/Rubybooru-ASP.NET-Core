namespace Rubybooru.Core
{
    public class TagDuplicate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TargetTagId { get; set; }
        public virtual Tag TargetTag { get; set; }
    }
}