using System.Collections.Generic;
using Rubybooru.Core;

namespace Rubybooru.Data.Interfaces
{
    public interface IDuplicateRecordData
    {
        IEnumerable<DuplicateRecord> GetAll(int limit, int offset);

        int Count();
        
        DuplicateRecord GetById(int id);

        DuplicateRecord Add(DuplicateRecord duplicateRecord);

        DuplicateRecord Update(DuplicateRecord duplicateRecord);

        DuplicateRecord Delete(int id);

        int Commit();
    }
}