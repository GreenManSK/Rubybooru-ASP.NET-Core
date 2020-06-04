using System;
using System.ComponentModel.DataAnnotations;

namespace Rubybooru.DTO
{
    public class ImageDto
    {
        public int Id { get; set; }
        [Required] public string Name { get; set; }
        [Required] public string Path { get; set; }
        public DateTime AddedDateTime { get; set; }
        [Required] public int Width { get; set; }
        [Required] public int Height { get; set; }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(Name)}: {Name}, {nameof(Path)}: {Path}, {nameof(AddedDateTime)}: {AddedDateTime}, {nameof(Width)}: {Width}, {nameof(Height)}: {Height}";
        }
    }
}