﻿//using System;
//using System.Collections.Generic;
//using System.Data.Entity;
//using System.Linq;
//using System.Linq.Expressions;
//using System.Threading.Tasks;
//using System.Web;

//namespace Iteration0.Data.Repositories
//{
//    /// <summary>
//    /// Generic repository pattern implementation
//    /// Repository  Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.
//    /// </summary>
//    /// <remarks>
//    /// More info: https://martinfowler.com/eaaCatalog/repository.html
//    /// </remarks>
//    /// <typeparam name="TEntity">The type of the entity.</typeparam>
//    /// <typeparam name="TKey">The type of the key.</typeparam>
//    /// <autogeneratedoc />
//    public interface IMasterRepository<TEntity, in TKey> where TEntity : class
//    {
//        /// <summary>
//        ///     Gets entity (of type) from repository based on given ID
//        /// </summary>
//        /// <param name="id">The identifier.</param>
//        /// <returns>Entity</returns>
//        /// <autogeneratedoc />
//        TEntity Get(TKey id);

//        /// <summary>
//        /// Asynchronously gets entity (of type) from repository based on given ID
//        /// </summary>
//        /// <param name="id">The identifier.</param>
//        /// <returns></returns>
//        /// <autogeneratedoc />
//        Task<TEntity> GetAsnyc(TKey id);

//        /// <summary>
//        ///     Gets all entities of type from repository
//        /// </summary>
//        /// <returns></returns>
//        /// <autogeneratedoc />
//        IEnumerable<TEntity> GetAll();

//        /// <summary>
//        ///  Asynchronously gets all entities of type from repository
//        /// </summary>
//        /// <returns></returns>
//        /// <autogeneratedoc />
//        Task<IEnumerable<TEntity>> GetAllAsync();

//        /// <summary>
//        ///     Finds all entities of type which match given predicate
//        /// </summary>
//        /// <param name="predicate">The predicate.</param>
//        /// <returns>Entities which satisfy conditions</returns>
//        /// <autogeneratedoc />
//        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);
//    }


//    //Note to self: according to P of EAA Repo plays nicely with QueryObject, Data mapper and Metadata mapper - Learn about those !!!



//    /// <summary>
//    /// Generic repository pattern implementation
//    /// Repository  Mediates between the domain and data mapping layers using a collection-like interface for accessing domain objects.
//    /// </summary>
//    /// <typeparam name="TEntity">The type of the entity.</typeparam>
//    /// <typeparam name="TKey">The type of the key.</typeparam>
//    /// <seealso cref="Master.Domain.DataAccessLayer.Repository.Generic.IMasterRepository{TEntity, TKey}" />
//    /// <inheritdoc cref="IMasterRepository{TEntity,TKey}" />
//    public class MasterRepository<TEntity, TKey> : IMasterRepository<TEntity, TKey>
//        where TEntity : class
//    {

//        /// <summary>
//        /// DbSet is part of EF, it holds entities of the context in memory, per EF guidelines DbSet was used instead of IDbSet 
//        /// </summary>
//        /// <remarks>
//        /// <para>
//        /// Even though we are not 100% happy about this, 
//        /// We decided to go with this instead of (for example) IEnumerable so that we can use benefits of <see cref="DbSet"/>
//        /// Those benefits for example are Find and FindAsync methods which are much faster in fetching entities by their key than for example Single of First methods
//        /// </para>
//        /// </remarks>
//        /// <autogeneratedoc />
//        private readonly DbSet<TEntity> _dbSet;


//        /// <summary>
//        /// Initializes a new instance of the <see cref="MasterRepository{TEntity, TKey}"/> class.
//        /// </summary>
//        /// <param name="unitOfWork">The unit of work.</param>
//        /// <exception cref="ArgumentNullException">unitOfWork - Unit of work cannot be null</exception>
//        /// <autogeneratedoc />
//        public MasterRepository(IUnitOfWork unitOfWork)
//        {
//            if (unitOfWork == null)
//            {
//                throw new ArgumentNullException(nameof(unitOfWork), @"Unit of work cannot be null");
//            }

//            _dbSet = unitOfWork.DatabaseContext.Set<TEntity>();
//        }

//        /// <inheritdoc />
//        /// <summary>
//        /// Gets entity with given key
//        /// </summary>
//        /// <param name="id">The key of the entity</param>
//        /// <returns>Entity with key id</returns>
//        public TEntity Get(TKey id)
//        {
//            return _dbSet.Find(id);
//        }

//        /// <inheritdoc />
//        /// <summary>
//        /// Asynchronously gets entity with given key
//        /// </summary>
//        /// <param name="id">The key of the entity</param>
//        /// <returns>Entity with key id</returns>
//        public async Task<TEntity> GetAsnyc(TKey id)
//        {
//            return await _dbSet.FindAsync(id);
//        }

//        /// <inheritdoc />
//        /// <summary>
//        /// Gets all entities
//        /// </summary>
//        /// <returns>List of entities of type TEntiy</returns>
//        public IEnumerable<TEntity> GetAll()
//        {
//            return _dbSet.ToList();
//        }

//        public async Task<IEnumerable<TEntity>> GetAllAsync()
//        {
//            return await _dbSet.ToListAsync();

//        }

//        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
//        {
//            return _dbSet.Where(predicate).ToList();
//        }

//    }
//}