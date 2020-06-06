using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Rubybooru.Data.Interfaces;
using Rubybooru.DTO;
using Rubybooru.Helpers;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageController : ControllerBase
    {
        public const string StaticImagesPath = "/static/images";
        
        private readonly ILogger<ImageController> _logger;
        private readonly IImageData _imageData;
        private readonly IMapper _mapper;
        private readonly PreviewGenerator _previewGenerator;

        public ImageController(ILogger<ImageController> logger, IImageData imageData, IMapper mapper, PreviewGenerator previewGenerator)
        {
            _logger = logger;
            _imageData = imageData;
            _mapper = mapper;
            _previewGenerator = previewGenerator;
        }

        [HttpGet]
        public ActionResult<ImageDto[]> Get(int limit = 10, int offset = 0, [FromQuery] int[] withTags = null)
        {
            // TODO: Add size conditions
            try
            {
                var images = _imageData.GetAll(limit, offset, withTags);
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
                return RedirectPermanent(Path.Combine(StaticImagesPath, image.Path, image.Name));
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

                var previewPath = _previewGenerator.CreatePreview(image, width, height, keepAspectRatio);
                return RedirectPermanent(previewPath);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting preview for image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }
    }
}