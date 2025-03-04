using System;
using NumSharp;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.IO;

namespace Rubybooru.Images.DuplicateFinder
{
    public class ImagePreprocessorUtils
    {

        public int[,] GetImageArray(Stream stream)
        {
            using var image = Image.Load<Rgba32>(stream);
            var array = new int[image.Width, image.Height];
            image.ProcessPixelRows(accessor =>
            {
                for (var y = 0; y < accessor.Height; y++)
                {
                    var row = accessor.GetRowSpan(y);
                    for (var x = 0; x < row.Length; x++)
                    {
                        ref var pixel = ref row[x];
                        array[y, x] = pixel.G;
                    }
                }
            });
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