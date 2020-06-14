using System;
using System.IO;
using ImageProcessor;
using ImageProcessor.Configuration;
using ImageProcessor.Imaging.Quantizers;
using ImageProcessor.Plugins.WebP.Imaging.Formats;
using NumSharp;

namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessorUtils
    {
        private readonly IQuantizer _quantizer;

        public ImagePreprocessorUtils(IQuantizer quantizer)
        {
            _quantizer = quantizer;
            ImageProcessorBootstrapper.Instance.AddImageFormats(new WebPFormat());
        }

        public int[,] GetImageArray(string path)
        {
            var imageBytes = File.ReadAllBytes(path);
            using var inStream = new MemoryStream(imageBytes);
            
            var imageFactory = new ImageFactory();
            imageFactory.Load(inStream);
            var image = imageFactory.Image;

            var bitmap = _quantizer.Quantize(image);
            var array = new int[image.Width,image.Height];
            for (var x = 0; x < image.Width; x++)
            {
                for (var y = 0; y < image.Height; y++)
                {
                    array[y, x] = bitmap.GetPixel(x, y).G;
                }
            }

            return array;
        }

        public double MeanSquaredError(int[,] a, int[,] b)
        {
            var errors = np.power(np.subtract(np.array(a), np.array(b)), 2);
            var dividedErrors = np.mod(errors, np.array(256));
            var average = np.divide(np.sum(dividedErrors), np.array(1.0 * dividedErrors.size));
            return Math.Sqrt(average.GetValue<double>());
        }
    }
}