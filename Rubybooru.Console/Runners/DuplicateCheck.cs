using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Rubybooru.Console.Options;
using Rubybooru.Core;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;
using Rubybooru.Images.DuplicateFinder;
using System.Security.Cryptography;
using System.Text;

namespace Rubybooru.Console.Runners
{
    public class DuplicateCheck
    {
        private readonly RubybooruDbContext _db;
        private readonly IImagePreprocessorFactory _imagePreprocessorFactory;
        private readonly ImagePreprocessorUtils _imageUtils;
        private readonly IImageData _imageData;
        private readonly IDuplicateRecordData _duplicateRecordData;
        private readonly IConfiguration _configuration;
        private readonly HashAlgorithm _hashAlgorithm;

        private readonly string _imagesPath;
        private readonly string _bwPath;
        private readonly int _maxRms;

        private int counter;

        public DuplicateCheck(
            RubybooruDbContext db,
            IImagePreprocessorFactory imagePreprocessorFactory,
            ImagePreprocessorUtils imageUtils,
            IImageData imageData,
            IDuplicateRecordData duplicateRecordData,
            IConfiguration configuration,
            HashAlgorithm hashAlgorithm)
        {
            _db = db;
            _imagePreprocessorFactory = imagePreprocessorFactory;
            _imageUtils = imageUtils;
            _imageData = imageData;
            _duplicateRecordData = duplicateRecordData;
            _configuration = configuration;
            _hashAlgorithm = hashAlgorithm;

            _imagesPath = _configuration.GetValue<string>("ImagesPath");
            _bwPath = _configuration.GetValue<string>("BlackWhitePath");
            _maxRms = _configuration.GetValue<int>("DuplicateCheckerMaxRMS");
        }

        public int Run(DuplicateCheckOptions options)
        {
            System.Console.WriteLine("Creating bw images");
            var uncheckedImages = from i in _db.Images where !i.DuplicateCheck orderby i.Id select i;
            CreateBwImages(uncheckedImages);

            System.Console.WriteLine("Loading all bw images");
            var allImages = (from i in _db.Images orderby i.Id select i).ToList();
            var bwImages = LoadImages(allImages);

            System.Console.WriteLine("Checking for duplicates");
            foreach (var uncheckedImage in uncheckedImages)
            {
                CheckIfDuplicate(uncheckedImage, allImages, bwImages);
                counter++;
                if (counter % 100 == 0)
                {
                    System.Console.WriteLine($"Checked {counter} images");
                }
            }

            System.Console.WriteLine("Saving results");
            _duplicateRecordData.Commit();

            return 0;
        }

        private void CheckIfDuplicate(Image uncheckedImage, List<Image> allImages, Dictionary<int, int[][,]> bwImages)
        {
            var uncheckedBw = bwImages[uncheckedImage.Id];

            foreach (var image in allImages)
            {
                if (image.Id == uncheckedImage.Id)
                {
                    break;
                }

                var imageBw = bwImages[image.Id];

                if (IsDuplicate(uncheckedBw, imageBw))
                {
                    _duplicateRecordData.Add(new DuplicateRecord()
                    {
                        ImageAId = uncheckedImage.Id,
                        ImageBId = image.Id
                    });
                }
            }

            uncheckedImage.DuplicateCheck = true;
        }

        private bool IsDuplicate(int[][,] uncheckedBw, int[][,] imageBw)
        {
            if (_imageUtils.MeanSquaredError(uncheckedBw[0], imageBw[0]) < _maxRms)
                return true;
            if (_imageUtils.MeanSquaredError(uncheckedBw[0], imageBw[1]) < _maxRms)
                return true;
            if (_imageUtils.MeanSquaredError(uncheckedBw[1], imageBw[0]) < _maxRms)
                return true;
            return false;
        }

        private Dictionary<int, int[][,]> LoadImages(IEnumerable<Image> images)
        {
            var result = new Dictionary<int, int[][,]>();
            foreach (var image in images)
            {
                result.Add(image.Id, new[]
                {
                    _imageUtils.GetImageArray(GetFullBwPath(image)),
                    _imageUtils.GetImageArray(GetFullBwPath(image, true))
                });
            }

            return result;
        }

        private void CreateBwImages(IEnumerable<Image> uncheckedImages)
        {
            foreach (var image in uncheckedImages)
            {
                try
                {
                    var imagePreprocessor = _imagePreprocessorFactory.Create(GetFullPath(image));
                    var bwPath = GetFullBwPath(image);
                    if (!File.Exists(bwPath))
                    {
                        imagePreprocessor.Save(bwPath);
                    }

                    var bwPathRotated = GetFullBwPath(image, true);
                    if (!File.Exists(bwPathRotated))
                    {
                        imagePreprocessor.SaveRotated(bwPathRotated);
                    }
                }
                catch (Exception e)
                {
                    System.Console.Error.WriteLine(
                        $"Error while creating bw version of {image.Path}/{image.Name}: {e}");
                }
            }
        }

        private string GetFullPath(Image image)
        {
            return Path.Combine(_imagesPath, image.Path, image.Name);
        }

        private string GetFullBwPath(Image image, bool rotated = false)
        {
            var hash = GetHash(Path.Combine(image.Path, image.Name));
            var rotatedSuffix = rotated ? "_r" : "";
            return Path.Combine(_bwPath, $"{hash}{rotatedSuffix}.png");
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