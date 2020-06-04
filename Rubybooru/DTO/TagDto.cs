using System.ComponentModel.DataAnnotations;
using Rubybooru.Core;

namespace Rubybooru.DTO
{
    public class TagDto
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; }
        [Required] public TagType Type { get; set; }
        public bool UserCreated { get; set; }
        public int Count { get; set; }
    }
}