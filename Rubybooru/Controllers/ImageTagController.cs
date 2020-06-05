using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using Rubybooru.DTO;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("image/{id}/tag")]
    public class ImageTagController : ControllerBase
    {
        private readonly ILogger<ImageTagController> _logger;
        private readonly IImageData _imageData;
        private readonly ITagData _tagData;
        private readonly IMapper _mapper;

        public ImageTagController(
            ILogger<ImageTagController> logger,
            IImageData imageData,
            ITagData tagData,
            IMapper mapper
        )
        {
            _logger = logger;
            _imageData = imageData;
            _tagData = tagData;
            _mapper = mapper;
        }

        [HttpGet]
        public ActionResult<TagDto[]> GetTags(int id)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound();
                }

                return _mapper.Map<TagDto[]>(image.Tags);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpPost("{tagId}")]
        public ActionResult<TagDto[]> AddTag(int id, int tagId)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound("Image not found");
                }

                if (image.Tags.All(it => it.TagId != tagId))
                {
                    var tag = _tagData.GetById(tagId);
                    if (tag == null)
                    {
                        return NotFound("Tag not found");
                    }

                    var imageTag = new ImageTag(image, tag);
                    image.Tags.Add(imageTag);
                    _imageData.Commit();
                }
                
                return _mapper.Map<TagDto[]>(image.Tags);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while adding tag with id {tagId} to image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpDelete("{tagId}")]
        public ActionResult<TagDto[]> RemoveTag(int id, int tagId)
        {
            try
            {
                var image = _imageData.GetById(id);
                if (image == null)
                {
                    return NotFound("Image not found");
                }

                var imageTag = image.Tags.Find(it => it.TagId == tagId);
                if (imageTag != null)
                {
                    image.Tags.Remove(imageTag);
                    _imageData.Commit();
                }

                return _mapper.Map<TagDto[]>(image.Tags);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while removing tag with id {tagId} to image with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }
    }
}