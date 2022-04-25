using System.IO;
using Microsoft.Extensions.Configuration;
using Rubybooru.Core;
using Rubybooru.Images;

namespace Rubybooru.Helpers
{
    public class PreviewGenerator
    {
        public const string StaticPreviewsPath = "/static/previews";
        private const int Quality = 70;

        private readonly IPreviewMaker _previewMaker;
        private readonly IConfiguration _configuration;

        public PreviewGenerator(IPreviewMaker previewMaker, IConfiguration configuration)
        {
            // TODO: Add list of allowed preview sizes
            _previewMaker = previewMaker;
            _configuration = configuration;
        }

        public string CreatePreview(Image image, int width, int height, bool keepAspectRatio)
        {
            var imagePath = Path.Combine(image.GetSafePath(), image.Name);
            var imageFullPath = Path.Combine(_configuration.GetValue<string>("ImagesPath"), imagePath);

            var fileName = GenerateFileName(image, width, height, keepAspectRatio);
            var previewFilePath = Path.Combine(_configuration.GetValue<string>("PreviewsPath"), fileName);
            if (!File.Exists(previewFilePath))
            {
                _previewMaker.CreatePreview(imageFullPath, previewFilePath, width, height, keepAspectRatio, Quality);
            }

            return Path.Combine(StaticPreviewsPath, fileName);
        }

        private string GenerateFileName(Image image, in int width, in int height, in bool keepAspectRatio)
        {
            return $"{image.Id}_{width}_{height}_{keepAspectRatio}.jpg";
        }
    }
}