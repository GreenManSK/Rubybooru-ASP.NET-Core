using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TestController : ControllerBase
    {
        private readonly IImageData _imageData;

        public TestController(IImageData imageData)
        {
            _imageData = imageData;
        }

        [HttpGet]
        public IEnumerable<Image> Get()
        {
            return _imageData.GetAll(15, 10, new[]
            {
                5, 8, 12
            }, new ISizeCondition[]
            {
                new TestSize(), new TestSize2(), 
            });
        }
    }

    public class TestSize : ISizeCondition
    {
        public IQueryable<Image> Apply(IQueryable<Image> images)
        {
            return images.Where(i => i.Width > i.Height);
        }
    }

    public class TestSize2 : ISizeCondition
    {
        public IQueryable<Image> Apply(IQueryable<Image> images)
        {
            return images.Where(i => i.Width > 150);
        }
    }
}