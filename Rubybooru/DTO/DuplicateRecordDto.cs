namespace Rubybooru.DTO
{
    public class DuplicateRecordDto
    {
        public int Id { get; set; }
        public ImageDto ImageA { get; set; }
        public ImageDto ImageB { get; set; }

        public override string ToString()
        {
            return $"{nameof(Id)}: {Id}, {nameof(ImageA)}: {ImageA}, {nameof(ImageB)}: {ImageB}";
        }
    }
}