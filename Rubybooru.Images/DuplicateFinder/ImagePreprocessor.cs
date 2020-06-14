using System;
using System.Drawing;
using System.IO;
using ImageProcessor;
using ImageProcessor.Imaging;
using ImageProcessor.Imaging.Filters.Photo;
using ImageProcessor.Imaging.Formats;

namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessor : IDisposable
    {
        private const int Size = 32;
        private static readonly FormatBase Format = new PngFormat();

        public string ImagePath { get; set; }

        private ImageFactory _imageFactory;

        public ImagePreprocessor(string imagePath)
        {
            ImagePath = imagePath;
        }

        private void LoadImage()
        {
            if (_imageFactory != null)
            {
                return;
            }

            var imageBytes = File.ReadAllBytes(ImagePath);
            using var inStream = new MemoryStream(imageBytes);
            
            var size = new Size(Size, Size);
            var resizeLayer = new ResizeLayer(size, ResizeMode.Stretch);

            _imageFactory = new ImageFactory();
            _imageFactory.Load(inStream)
                .Resize(resizeLayer)
                .Filter(MatrixFilters.GreyScale);
        }

        public void Save(string path)
        {
            using var outStream = File.Create(path);
            _imageFactory.Format(Format)
                .Save(outStream);
        }

        public void SaveRotated(string path)
        {
            using var outStream = File.Create(path);
            _imageFactory.Rotate(180)
                .Format(Format)
                .Save(outStream);
        }

        public void Dispose()
        {
            _imageFactory?.Dispose();
        }
    }
}