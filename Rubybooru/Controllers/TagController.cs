using System;
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
    [Route("[controller]")]
    public class TagController : ControllerBase
    {
        private readonly ILogger<TagController> _logger;
        private readonly ITagData _tagData;
        private readonly IMapper _mapper;

        public TagController(ILogger<TagController> logger, ITagData tagData, IMapper mapper)
        {
            _logger = logger;
            _tagData = tagData;
            _mapper = mapper;
        }

        [HttpGet]
        public TagDto[] GetAll(
            int limit,
            int offset,
            TagSortOrder sortOrder = TagSortOrder.Name,
            TagType? tagType = null
        )
        {
            var result = _tagData.GetAll(limit, offset, sortOrder, tagType);
            return _mapper.Map<TagDto[]>(result);
        }
        
        
        [HttpGet("{id}")]
        public ActionResult<TagDto> Get(int id)
        {
            try
            {
                var tag = _tagData.GetById(id);
                if (tag == null)
                {
                    return NotFound();
                }
                return _mapper.Map<TagDto>(tag);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting tag with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpPost]
        public ActionResult<TagDto> Add(TagDto tagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var tag = _mapper.Map<Tag>(tagDto);
                _tagData.Add(tag);
                _tagData.Commit();
                return _mapper.Map<TagDto>(tag);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while adding tag {tagDto}", tagDto);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpPut("{id}")]
        public ActionResult<TagDto> Update(int id, TagDto tagDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var oldTag = _tagData.GetById(id);
                if (oldTag == null)
                {
                    return NotFound($"Could not find tag with id {id}");
                }

                _mapper.Map(tagDto, oldTag);
                _tagData.Commit();
                return _mapper.Map<TagDto>(oldTag);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while updating tag {tagDto}", tagDto);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpDelete("{id}")]
        public ActionResult<TagDto> Delete(int id)
        {
            try
            {
                _tagData.Delete(id);
                _tagData.Commit();
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while deleting tag with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }
    }
}