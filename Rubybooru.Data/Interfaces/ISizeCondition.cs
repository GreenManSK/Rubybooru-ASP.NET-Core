using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface ISizeCondition
    {
        IEnumerable<Image> Filter(IEnumerable<Image> images);
    }
}