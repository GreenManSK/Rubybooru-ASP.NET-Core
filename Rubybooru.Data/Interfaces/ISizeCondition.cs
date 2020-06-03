using System.Linq;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface ISizeCondition
    {
        IQueryable<Image> Apply(IQueryable<Image> images);
    }
}