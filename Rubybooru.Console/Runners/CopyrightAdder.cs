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

        public CopyrightAdder(RubybooruDbContext db, ITagData tagData)
        {
            _db = db;
            _tagData = tagData;
        }
        public int Run(CopyrightAdderOptions options)
        {
            if (options.RawImageData != null)
            {
                return MapCreator.Create(options.RawImageData, options.CopyrightMapPath, options.PercentageLimit);
            }
            else
            {
                var adder = new Adder(_db, _tagData);
                return adder.Add(options.CopyrightMapPath, options.StartId, options.EndId);
            }
        }


    }
}