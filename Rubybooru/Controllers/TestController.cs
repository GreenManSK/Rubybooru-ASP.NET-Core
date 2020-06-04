using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;
using Rubybooru.DTO;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IImageData _imageData;
        private readonly ITagData _tagData;
        private readonly IImageTagData _imageTagData;
        private readonly IMapper _mapper;

        public TestController(IImageData imageData, ITagData tagData, IImageTagData imageTagData, IMapper mapper)
        {
            _imageData = imageData;
            _tagData = tagData;
            _imageTagData = imageTagData;
            _mapper = mapper;
        }

        [HttpGet]
        public Dictionary<string, TagDto[]> Get()
        {
            var result = _imageData.GetTags(new[] {64, 128, 555, 688});
            return result.ToDictionary(
                v => v.Key.ToString(),
                v => v.Value.Select(it =>  _mapper.Map<TagDto>(it.Tag)).ToArray()
            );
        }
    }
}