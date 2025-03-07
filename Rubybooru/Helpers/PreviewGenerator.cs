using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Rubybooru.Core;
using Rubybooru.Images;
using Rubybooru.Data.Interfaces;
using Rubybooru.Configuration;

namespace Rubybooru.Helpers
{
    public class PreviewGenerator
    {
        private const int Quality = 70;

        private readonly IPreviewMaker _previewMaker;
        private readonly IConfiguration _configuration;
        private readonly IImagePreviewData _imagePreviewData;
        private readonly HashSet<(int Width, int Height, bool KeepRatio)> _allowedPreviewOptionsSet;

        public PreviewGenerator(
            IPreviewMaker previewMaker,
            IConfiguration configuration,
            IImagePreviewData imagePreviewData,
            IOptions<AllowedPreviewOptions> allowedPreviewOptions)
        {
            _previewMaker = previewMaker;
            _configuration = configuration;
            _imagePreviewData = imagePreviewData;

            // Initialize the HashSet with allowed options
            _allowedPreviewOptionsSet = new HashSet<(int, int, bool)>();
            foreach (var option in allowedPreviewOptions.Value.Options)
            {
                _allowedPreviewOptionsSet.Add((option.Width, option.Height, option.KeepRatio));
            }
        }

        public byte[] CreatePreview(Image image, int width, int height, bool keepAspectRatio)
        {
            // Check if the requested size is allowed using the HashSet
            if (!_allowedPreviewOptionsSet.Contains((width, height, keepAspectRatio)))
            {
                return null;
            }

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