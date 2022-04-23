using System;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessor : IDisposable
    {
        private const int Size = 32;

        public string ImagePath { get; set; }
        private Image _image;
        private readonly ResizeOptions ResizeOptions = new ResizeOptions
        {
            Size = new Size(Size, Size),
            Mode = ResizeMode.Stretch
        };

        public ImagePreprocessor(string imagePath)
        {
            ImagePath = imagePath;
        }

        private void LoadImage()
        {
            _image = Image.Load(ImagePath);
            _image.Mutate(img =>
            {
                var shouldRotate = _image.Height > _image.Width;
                img.Resize(ResizeOptions);
                img.Grayscale();
                if (shouldRotate)
                {
                    img.Rotate(-90);
                }
            });
        }

        public void Save(string path)
        {
            LoadImage();
            _image.SaveAsPng(path);
        }

        public void SaveRotated(string path)
        {
            LoadImage();
            _image.Mutate(img => img.Rotate(180));
        }

        public void Dispose()
        {
            _image?.Dispose();
        }
    }
}