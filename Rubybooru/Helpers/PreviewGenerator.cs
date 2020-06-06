using System.IO;
using System.Security.Cryptography;
using System.Text;
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
        private readonly HashAlgorithm _hashAlgorithm;
        private readonly IConfiguration _configuration;

        public PreviewGenerator(IPreviewMaker previewMaker, HashAlgorithm hashAlgorithm, IConfiguration configuration)
        {
            // TODO: Add list of allowed preview sizes
            _previewMaker = previewMaker;
            _hashAlgorithm = hashAlgorithm;
            _configuration = configuration;
        }

        public string CreatePreview(Image image, int width, int height, bool keepAspectRatio)
        {
            var imagePath = Path.Combine(image.Path, image.Name);
            var imageFullPath = Path.Combine(_configuration.GetValue<string>("ImagesPath"), imagePath);

            if (!File.Exists(imageFullPath))
            {
                return Path.Combine(StaticPreviewsPath, _configuration.GetValue<string>("DefaultPlaceholder"));
            }
            
            var fileName = GenerateFileName(imagePath, width, height, keepAspectRatio);
            var previewFilePath = Path.Combine(_configuration.GetValue<string>("PreviewsPath"), fileName);
            if (!File.Exists(previewFilePath))
            {
                _previewMaker.CreatePreview(imageFullPath, previewFilePath, width, height, keepAspectRatio, Quality);
            }

            return Path.Combine(StaticPreviewsPath, fileName);
        }

        private string GenerateFileName(string imagePath, in int width, in int height, in bool keepAspectRatio)
        {
            var hash = GetHash(imagePath);
            return $"{hash}_{width}_{height}_{keepAspectRatio}.jpg";
        }

        private string GetHash(string imagePath)
        {
            var result = _hashAlgorithm.ComputeHash(Encoding.UTF8.GetBytes(imagePath));
            var hash = new StringBuilder();
            foreach (var theByte in result)
            {
                hash.Append(theByte.ToString("x2"));
            }

            return hash.ToString();
        }
    }
}