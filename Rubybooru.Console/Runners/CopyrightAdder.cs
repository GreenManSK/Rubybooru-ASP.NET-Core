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
            if (options.RawImageData != null)
            {
                return MapCreator.Create(options.RawImageData, options.CopyrightMapPath, options.PercentageLimit);
            }
            else
            {
                var adder = new Adder(_db, _tagData, _tagDuplicateData);
                return adder.Add(options.CopyrightMapPath, options.StartId, options.EndId);
            }
        }


    }
}