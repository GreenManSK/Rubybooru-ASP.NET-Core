using System.Collections.Generic;

namespace Rubybooru.Core
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TagType Type { get; set; }
        public bool UserCreated { get; set; }
        
        public virtual List<ImageTag> Images { get; set; } = new List<ImageTag>();
    }
}