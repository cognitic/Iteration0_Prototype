//using System;
//using System.Collections.Generic;
//using System.Data.Entity;
//using System.Linq;
//using System.Linq.Expressions;
//using Iteration0.Business.Interfaces;
//using Iteration0.Business.Domain.Entities;

//namespace Iteration0.Data.Repositories
//    {
//        public class RepositoryBase<TEntity> : IRepository<TEntity> where TEntity : class
//    {
//        DbContext _context;
//        DbSet<TEntity> _dbSet;

//        public RepositoryBase(DbContext context)
//        {
//            _context = context;
//            _dbSet = context.Set<TEntity>();
//        }

//        public IEnumerable<TEntity> GetAll()
//        {
//            return _dbSet.AsNoTracking().ToList();
//        }

//        public IEnumerable<TEntity> Get(Func<TEntity, bool> predicate)
//        {
//            return _dbSet.AsNoTracking().Where(predicate).ToList();
//        }
//        public TEntity FindById(long id)
//        {
//            return _dbSet.Find(id);
//        }

//        public bool Create(TEntity item)
//        {
//            _dbSet.Add(item);
//            _context.SaveChanges();
//            return true;
//        }
//        public bool Update(TEntity item)
//        {
//            _context.Entry(item).State = EntityState.Modified;
//            _context.SaveChanges();
//            return true;
//        }
//        public bool Disable(long id, long userId)
//        {
//            //_dbSet.Remove(item);
//            //_context.SaveChanges();
//            return false;
//        }
//    }
//}