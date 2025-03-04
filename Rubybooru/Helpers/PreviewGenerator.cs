using System.IO;
using Microsoft.Extensions.Configuration;
using Rubybooru.Core;
using Rubybooru.Images;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Helpers
{
    public class PreviewGenerator
    {
        private const int Quality = 70;

        private readonly IPreviewMaker _previewMaker;
        private readonly IConfiguration _configuration;
        private readonly IImagePreviewData _imagePreviewData;

        public PreviewGenerator(IPreviewMaker previewMaker, IConfiguration configuration, IImagePreviewData imagePreviewData)
        {
            // TODO: Add list of allowed preview sizes
            _previewMaker = previewMaker;
            _configuration = configuration;
            _imagePreviewData = imagePreviewData;
        }

        public byte[] CreatePreview(Image image, int width, int height, bool keepAspectRatio)
        {
            var existingPreview = _imagePreviewData.Get(image.Id, width, height, keepAspectRatio);
            if (existingPreview != null)
            {
                return existingPreview.PreviewData;
            }

            var imagePath = Path.Combine(image.GetSafePath(), image.Name);
            var imageFullPath = Path.Combine(_configuration.GetValue<string>("ImagesPath"), imagePath);
            var previewData = _previewMaker.CreatePreview(imageFullPath, width, height, keepAspectRatio, Quality);

            var newPreview = new ImagePreview
            {
                ImageId = image.Id,
                PreviewData = previewData,
                Width = width,
                Height = height,
                KeepAspectRatio = keepAspectRatio
            };
            _imagePreviewData.Add(newPreview);
            _imagePreviewData.Commit();

            return previewData;
        }
    }
}