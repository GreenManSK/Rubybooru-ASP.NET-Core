using System.Linq;
using Rubybooru.Console.Options;
using Rubybooru.Data;
using Rubybooru.Helpers;

namespace Rubybooru.Console.Runners
{
    public class GeneratePreview
    {
        private readonly RubybooruDbContext _db;
        private readonly PreviewGenerator _previewGenerator;

        public GeneratePreview(RubybooruDbContext db, PreviewGenerator previewGenerator)
        {
            _db = db;
            _previewGenerator = previewGenerator;
        }

        public int Run(GeneratePreviewOptions options)
        {
            var images = from i in _db.Images select i;
            foreach (var image in images)
            {
                _previewGenerator.CreatePreview(image, options.Width, options.Height, options.KeepRatio);
            }
            return 0;
        }
    }
}