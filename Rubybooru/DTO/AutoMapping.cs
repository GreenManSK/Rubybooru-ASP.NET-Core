using AutoMapper;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.DTO
{
    public class AutoMapping : Profile
    {
        public AutoMapping()
        {
            // To DTO
            CreateMap<Tag, TagDto>();
            CreateMap<ImageTag, ImageTagDto>();
            CreateMap<Image, ImageDto>();
            CreateMapTagDto<TagWithCount>();
            CreateMapTagDto<ImageTag>();
            CreateMap<DuplicateRecord, DuplicateRecordDto>();
            
            // From DTO
            CreateMap<TagDto, Tag>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<ImageDto, Image>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<ImageTagDto, ImageTag>();
        }

        private void CreateMapTagDto<TType>() where TType : HasTagProperty
        {
            CreateMap<TType, TagDto>()
                .ForMember(t => t.Name, o => o.MapFrom(t => t.Tag.Name))
                .ForMember(t => t.Type, o => o.MapFrom(t => t.Tag.Type))
                .ForMember(t => t.UserCreated, o => o.MapFrom(t => t.Tag.UserCreated))
                .ForMember(t => t.Id, o => o.MapFrom(t => t.Tag.Id));
        }
    }
}