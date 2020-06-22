using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagDuplicateController : ControllerBase
    {
        private readonly ILogger<ImageController> _logger;
        private readonly ITagData _tagData;
        private readonly ITagDuplicateData _tagDuplicateData;

        public TagDuplicateController(ILogger<ImageController> logger, ITagData tagData,
            ITagDuplicateData tagDuplicateData)
        {
            _logger = logger;
            _tagData = tagData;
            _tagDuplicateData = tagDuplicateData;
        }

        [HttpGet]
        public ActionResult Add(int originalId, int duplicateId)
        {
            try
            {
                var original = _tagData.GetById(originalId);
                if (original == null)
                {
                    return NotFound("Original tag not found");
                }

                var duplicate = _tagData.GetById(duplicateId);
                if (duplicate == null)
                {
                    return NotFound("Duplicate tag not found");
                }

                if (original.Id == duplicate.Id)
                {
                    return BadRequest("Original and duplicate can't be the same tag");
                }

                foreach (var imageTag in duplicate.Images)
                {
                    var image = imageTag.Image;
                    image.Tags.Remove(imageTag);
                    if (image.Tags.All(it => it.TagId != original.Id))
                    {
                        image.Tags.Add(new ImageTag(image, original));
                    }
                }

                _tagDuplicateData.Add(new TagDuplicate()
                {
                    Name = duplicate.Name,
                    TargetTagId = original.Id
                });
                _tagData.Delete(duplicate.Id);

                _tagDuplicateData.Commit();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error while setting tag {duplicateId} as duplicate of {originalId}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }
    }
}