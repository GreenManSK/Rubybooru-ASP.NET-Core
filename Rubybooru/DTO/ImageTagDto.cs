using System.ComponentModel.DataAnnotations;

namespace Rubybooru.DTO
{
    public class ImageTagDto
    {
        [Required] public int ImageId { get; set; }
        [Required] public int TagId { get; set; }
        public bool UserCreated { get; set; }
    }
}