using Rubybooru.Console.CopyrightAdder;
using Rubybooru.Console.Options;
using Rubybooru.Data;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Console.Runners
{
    public class CopyrightAdder
    {
        private readonly RubybooruDbContext _db;
        private readonly ITagData _tagData;
        private readonly ITagDuplicateData _tagDuplicateData;

        public CopyrightAdder(RubybooruDbContext db, ITagData tagData, ITagDuplicateData tagDuplicateData)
        {
            _db = db;
            _tagData = tagData;
            _tagDuplicateData = tagDuplicateData;
        }
        public int Run(CopyrightAdderOptions options)
        {
            if (options.AddSystemTags)
            {
                var adder = new Adder(_db, _tagData, _tagDuplicateData);
                return adder.AddSystemTags();
            } else if (options.RawImageData != null)
            {
                return MapCreator.Create(options.RawImageData, options.CopyrightMapPath, options.PercentageLimit);
            }
            else if (options.CopyrightMapPath != null)
            {
                var adder = new Adder(_db, _tagData, _tagDuplicateData);
                return adder.AddByCharacter(options.CopyrightMapPath, options.StartId, options.EndId);
            } else if (options.CopyrightTagId != -1 && options.FilterTagId != -1)
            {
                var adder = new Adder(_db, _tagData, _tagDuplicateData);
                return adder.AddByFilterTag(options.FilterTagId, options.CopyrightTagId, options.StartId, options.EndId);
            }
            else
            {
                System.Console.Error.WriteLine("Need raw image data, copyright map or filter and copyright tag id");
                return -1;
            }
        }


    }
}