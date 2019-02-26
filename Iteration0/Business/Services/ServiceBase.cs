using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Services
{
    //public abstract class ServiceBase<M, T, E> : IService<M, T, E>
    //    where E : RepositoryBase<T>
    //    where T : class
    //{
    //    E Entity;
    //    public ServiceBase(RepositoryBase<T> obj)
    //    {
    //        AutoMapper.Mapper.CreateMap<T, M>();
    //        AutoMapper.Mapper.CreateMap<M, T>();
    //        Entity = (E)obj;
    //    }

    //    public M GetSingle(System.Linq.Expressions.Expression<Func<T, bool>> whereCondition)
    //    {
    //        var model = Entity.GetQueryable().Where(whereCondition).FirstOrDefault();
    //        return Mapper.Map<T, M>(model);

    //    }

    //    public void Add(M entity)
    //    {
    //        var model = Mapper.Map<M, T>(entity);
    //        Entity.Add(model);
    //    }

    //    public void Delete(M entity)
    //    {
    //        T model = Mapper.Map<M, T>(entity);
    //        Entity.Delete(model);
    //    }

    //    public void Update(M entity)
    //    {
    //        try
    //        {
    //            T model = Mapper.Map<M, T>(entity);
    //            T tEntity = Entity.GetSingle(Entity.SearchFilters(model));
    //            Entity.Update(tEntity, model);
    //        }
    //        catch (Exception)
    //        {

    //            throw;
    //        }
    //    }

    //    public List<M> GetAll(System.Linq.Expressions.Expression<Func<T, bool>> whereCondition)
    //    {
    //        return Entity.GetQueryable().Where(whereCondition).Select(Mapper.Map<T, M>).ToList();
    //    }

    //    public List<M> GetAll()
    //    {
    //        return Entity.GetQueryable().Select(Mapper.Map<T, M>).ToList();
    //    }

    //    public IQueryable<T> Query(System.Linq.Expressions.Expression<Func<T, bool>> whereCondition)
    //    {
    //        return Entity.GetQueryable().Where(whereCondition).AsQueryable();
    //    }

    //    public int Count(System.Linq.Expressions.Expression<Func<T, bool>> whereCondition)
    //    {
    //        return Entity.GetQueryable().Where(whereCondition).Count();
    //    }

    //    public int Count()
    //    {
    //        return Entity.GetQueryable().Count();
    //    }
    //}
}