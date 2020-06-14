using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Rubybooru.Core;
using Rubybooru.Data.Interfaces;

namespace Rubybooru.Data.Sql
{
    public class SqlDuplicateRecordData : IDuplicateRecordData
    {
        private readonly RubybooruDbContext _db;

        public SqlDuplicateRecordData(RubybooruDbContext db)
        {
            _db = db;
        }

        public IEnumerable<DuplicateRecord> GetAll(int limit, int offset)
        {
            var query = from i in _db.DuplicateRecord
                orderby i.Id
                select i;
            return query.Skip(offset).Take(limit);
        }

        public int Count()
        {
            var query = from i in _db.DuplicateRecord
                select i;
            return query.Count();
        }

        public DuplicateRecord GetById(int id)
        {
            return _db.DuplicateRecord.Find(id);
        }

        public DuplicateRecord Add(DuplicateRecord duplicateRecord)
        {
            _db.Add(duplicateRecord);
            return duplicateRecord;
        }

        public DuplicateRecord Update(DuplicateRecord duplicateRecord)
        {
            var entity = _db.DuplicateRecord.Attach(duplicateRecord);
            entity.State = EntityState.Modified;
            return duplicateRecord;
        }

        public DuplicateRecord Delete(int id)
        {
            var duplicateRecord = GetById(id);

            if (duplicateRecord != null)
            {
                _db.DuplicateRecord.Remove(duplicateRecord);
            }

            return duplicateRecord;
        }

        public int Commit()
        {
            return _db.SaveChanges();
        }
    }
}