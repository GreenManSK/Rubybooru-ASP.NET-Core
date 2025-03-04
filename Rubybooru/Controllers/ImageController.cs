using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net;
using AutoMapper;
using Castle.Core.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Rubybooru.Conditions;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using Rubybooru.DTO;
using Rubybooru.Helpers;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        public const string StaticImagesPath = "/static/Images";

        private readonly ILogger<ImageController> _logger;
        private readonly IImageData _imageData;
        private readonly IMapper _mapper;
        private readonly PreviewGenerator _previewGenerator;

        public ImageController(ILogger<ImageController> logger, IImageData imageData, IMapper mapper,
            PreviewGenerator previewGenerator)
        {
            _logger = logger;
            _imageData = imageData;
            _mapper = mapper;
            _previewGenerator = previewGenerator;
        }

        [HttpGet]
        public ActionResult<ImageDto[]> Get([Range(1, 100)] int limit = 10, int offset = 0,
            [FromQuery] int[] withTags = null, [FromQuery] string[] sizeConditions = null)
        {
            var parsedSizeConditions = ParseSizeConditions(sizeConditions);
            if (parsedSizeConditions == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Error while parsing size conditions");
            }

            try
            {
                var images = _imageData.GetAll(limit, offset, withTags, parsedSizeConditions);
                return _mapper.Map<ImageDto[]>(images);
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting images with limit={limit}, offset={offset}, withTags={withTags}",
                    limit, offset, withTags);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("count")]
        public ActionResult<int> Count([FromQuery] int[] withTags = null, [FromQuery] string[] sizeConditions = null)
        {
            var parsedSizeConditions = ParseSizeConditions(sizeConditions);
            if (parsedSizeConditions == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Error while parsing size conditions");
            }

            try
            {
                return _imageData.CountImages(withTags, parsedSizeConditions);
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting images count with withTags={withTags}", withTags);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        private ISizeCondition[] ParseSizeConditions(string[] conditions)
        {
            var parsedConditions = new List<ISizeCondition>();
            if (conditions != null)
            {
                try
                {
                    foreach (var condition in conditions)
                    {
                        parsedConditions.Add(JsonConvert.DeserializeObject<BasicSizeCondition>(condition));
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error while parsing size conditions {conditions}", conditions);
                    return null;
                }
            }

            return parsedConditions.ToArray();
        }

        [HttpGet("without-tag")]
        public ActionResult<ImageDto[]> GetWithoutTagType([Range(1, 100)] int limit = 10, int offset = 0,
            TagType tagType = TagType.Copyright, int? year = null)
        {
            try
            {
                var images = _imageData.GetWithoutTagType(limit, offset, tagType, year);
                return _mapper.Map<ImageDto[]>(images);
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting images without tagType={tagType} with limit={limit}, offset={offset}, year={year}", tagType,
                    limit, offset, year);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("without-tag/count")]
        public ActionResult<int> CountWithoutTagType(TagType tagType = TagType.Copyright, int? year = null)
        {
            try
            {
                return _imageData.CountWithoutTagType(tagType, year);
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting count of images without tagType={tagType}, year={year}", tagType, year);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("without-tag/years")]
        public ActionResult<int[]> GetYearsWithoutTagType(TagType tagType = TagType.Copyright)
        {
            try
            {
                return _imageData.GetYearsWithoutTagType(tagType).ToArray();
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting years of images without tagType={tagType}", tagType);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<ImageDto> Get(int id)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound();
                }

                return _mapper.Map<ImageDto>(image);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpDelete("{id}")]
        public ActionResult<ImageDto> Delete(int id)
        {
            try
            {
                var image = _imageData.Delete(id);
                _imageData.Commit();
                return _mapper.Map<ImageDto>(image);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while deleting image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("tags")]
        public ActionResult<Dictionary<string, TagDto[]>> GetTags([FromQuery] int[] ids)
        {
            try
            {
                var result = _imageData.GetTags(ids);
                return result.ToDictionary(x => x.Key.ToString(), x => _mapper.Map<TagDto[]>(x.Value));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting tags for images with ids {ids}", ids);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id}/file")]
        public ActionResult GetImage(int id)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound();
                }

                var redirectUrl = Path.Combine(StaticImagesPath, PathHelper.PrepareUrl(image.Path.Replace('\\', '/')),
                    Uri.EscapeUriString(image.Name));
                return Redirect(redirectUrl);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting file for image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id}/preview")]
        public ActionResult GetPreview(int id, int width, int height, bool keepAspectRatio = true)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound();
                }

                var previewData = _previewGenerator.CreatePreview(image, width, height, keepAspectRatio);
                if (previewData == null)
                {
                    return NotFound();
                }
                return File(previewData, "image/jpeg");
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting preview for image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("random")]
        public ActionResult<int> GetRandom([FromQuery] int[] withTags = null,
            [FromQuery] string[] sizeConditions = null)
        {
            try
            {
                if ((withTags == null || withTags.Length == 0) && (sizeConditions == null || sizeConditions.Length == 0))
                {
                    return _imageData.GetRandomId();
                }

                var parsedSizeConditions = ParseSizeConditions(sizeConditions);
                if (parsedSizeConditions == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Error while parsing size conditions");
                }

                return _imageData.GetRandomFilteredId(withTags, parsedSizeConditions);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting random image");
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }
    }
}