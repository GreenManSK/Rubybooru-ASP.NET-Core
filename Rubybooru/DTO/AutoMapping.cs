using AutoMapper;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.DTO
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            CreateMap<Tag, TagDto>();
            CreateMap<TagWithCount, TagDto>();
            CreateMap<ImageTag, ImageTagDto>();
            CreateMap<ImageTag, TagDto>();
            CreateMap<Image, ImageDto>();
        }
    }
}