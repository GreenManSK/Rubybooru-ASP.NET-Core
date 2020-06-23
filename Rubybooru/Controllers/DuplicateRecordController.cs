using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using Rubybooru.DTO;
using Rubybooru.Types;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DuplicateRecordController : ControllerBase
    {
        private readonly ILogger<ImageController> _logger;
        private readonly IDuplicateRecordData _duplicateRecordData;
        private readonly IImageData _imageData;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public DuplicateRecordController(
            ILogger<ImageController> logger,
            IDuplicateRecordData duplicateRecordData,
            IImageData imageData,
            IMapper mapper,
            IConfiguration configuration)
        {
            _logger = logger;
            _duplicateRecordData = duplicateRecordData;
            _imageData = imageData;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public ActionResult<DuplicateRecordDto[]> Get([Range(1, 100)] int limit = 10, int offset = 0)
        {
            try
            {
                var duplicates = _duplicateRecordData.GetAll(limit, offset).ToList();
                return _mapper.Map<DuplicateRecordDto[]>(duplicates);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting duplicate records with limit={limit}, offset={offset}", limit,
                    offset);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("count")]
        public ActionResult<int> Count()
        {
            try
            {
                return _duplicateRecordData.Count();
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while getting duplicate records count");
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("{id}")]
        public ActionResult<DuplicateRecordDto> Get(int id)
        {
            try
            {
                var record = _duplicateRecordData.GetById(id);
                if (record == null)
                {
                    return NotFound();
                }

                return _mapper.Map<DuplicateRecordDto>(record);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error while getting duplicate record with id {id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        [HttpGet("resolve/{id}")]
        public ActionResult Resolve(int id, DuplicateRecordResolution resolution, bool mergeTags = false)
        {
            try
            {
                var record = _duplicateRecordData.GetById(id);
                if (record == null)
                {
                    return NotFound();
                }

                switch (resolution)
                {
                    case DuplicateRecordResolution.A:
                        _imageData.MergeTags(record.ImageA, record.ImageB);
                        DeleteFile(record.ImageB);
                        _imageData.Delete(record.ImageBId);
                        break;
                    case DuplicateRecordResolution.B:
                        _imageData.MergeTags(record.ImageB, record.ImageA);
                        DeleteFile(record.ImageA);
                        _imageData.Delete(record.ImageAId);
                        break;
                    case DuplicateRecordResolution.NotDuplicate:
                        _duplicateRecordData.Delete(record.Id);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(resolution), resolution, null);
                }
                _duplicateRecordData.Commit();
                
                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e,
                    "Error while resolving duplicate record with id={id}, resolution={resolution}, mergeTags={mergeTags}",
                    id, resolution, mergeTags);
                return StatusCode(StatusCodes.Status500InternalServerError, "Database Failure");
            }
        }

        private void DeleteFile(Image image)
        {
            var imagePath = Path.Combine(image.Path, image.Name);
            var imageFullPath = Path.Combine(_configuration.GetValue<string>("ImagesPath"), imagePath);
            try
            {
                System.IO.File.Delete(imageFullPath);
            }
            catch (Exception e)
            {
                _logger.LogError(e,$"Error while deleting file {imageFullPath}");
            }
        }
    }
}