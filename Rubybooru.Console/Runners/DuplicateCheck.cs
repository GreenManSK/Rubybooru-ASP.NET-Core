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
        private readonly IConfiguration _configuration;
        private readonly HashAlgorithm _hashAlgorithm;

        private readonly string _imagesPath;
        private readonly string _bwPath;
        
        public DuplicateCheck(
            RubybooruDbContext db,
            IImagePreprocessorFactory imagePreprocessorFactory,
            ImagePreprocessorUtils imageUtils, 
            IImageData imageData,
            IConfiguration configuration,
            HashAlgorithm hashAlgorithm)
        {
            _db = db;
            _imagePreprocessorFactory = imagePreprocessorFactory;
            _imageUtils = imageUtils;
            _imageData = imageData;
            _configuration = configuration;
            _hashAlgorithm = hashAlgorithm;

            _imagesPath = _configuration.GetValue<string>("ImagesPath");
            _bwPath = _configuration.GetValue<string>("BlackWhitePath");
        }

        public int Run(DuplicateCheckOptions options)
        {
            var uncheckedImages = from i in _db.Images where !i.DuplicateCheck select i;
            CreateBwImages(uncheckedImages);

            // Get all checked images
            // Do the chekin'
            // Set new images as checked
            // Profit
            
            return 0;
        }

        private void CreateBwImages(IEnumerable<Image> uncheckedImages)
        {
            System.Console.WriteLine("Creating bw images");
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
                    System.Console.Error.WriteLine($"Error while creating bw version of {image.Path}/{image.Name}: {e}");
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