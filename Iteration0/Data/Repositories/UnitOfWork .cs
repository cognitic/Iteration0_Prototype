﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Iteration0.Data.Repositories
{
/// <summary>
/// Unit of work interface
/// Maintains a list of objects affected by a business transaction and coordinates the writing out of changes and the resolution of concurrency problems.
/// </summary>
/// <seealso cref="T:System.IDisposable" />
/// <autogeneratedoc />
public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Gets the database context. DatabaseContext is part of EF and itself is implementation of UoW (and repo) patterns
        /// </summary>
        /// <value>
        /// The database context.
        /// </value>
        /// <remarks> 
        /// If true  UoW was implemented this wouldn't be here, but we are exposing this for simplicity sake. 
        /// For example so that repository  could use benefits of DbContext and DbSet <see cref="DbSet"/>. One of those benefits are Find and FindAsnyc methods
        /// </remarks>
        /// <autogeneratedoc />
        DbContext DatabaseContext { get; }
        /// <summary>
        /// Commits the changes to database
        /// </summary>
        /// <returns></returns>
        /// <autogeneratedoc />
        void Commit();

        /// <summary>
        /// Asynchronously commits changes to database.
        /// </summary>
        /// <returns></returns>
        /// <autogeneratedoc />
        Task CommitAsync();

    }


    /// <inheritdoc />
    /// <summary>
    /// This is implementation of UoW pattern
    /// </summary>
    /// <remarks>
    /// Martin Fowler: "Maintains a list of objects affected by a business transaction and coordinates the writing out of changes and the resolution of concurrency problems."
    /// According to P of EEA, Unit of work should have following methods: commit(), registerNew((object), registerDirty(object), registerClean(object), registerDeleted(object)
    /// The thing is DbContext is already implementation of UoW so there is no need to implement all this
    /// In case that we were not using ORM all these methods would have been implemented
    /// </remarks>
    /// <seealso cref="T:Master.Domain.DataAccessLayer.UnitOfWork.IUnitOfWork" />
    /// <autogeneratedoc />
    public class UnitOfWork : IUnitOfWork
    {
        /// <summary>
        /// Is instance already disposed
        /// </summary>
        /// <remarks>
        /// Default value of bool is false
        /// </remarks>
        /// <autogeneratedoc />
        private bool _disposed;

        /// <summary>
        /// Initializes a new instance of the <see cref="UnitOfWork"/> class.
        /// </summary>
        /// <param name="dbContextfactory">The database context factory.</param>
        /// <exception cref="ArgumentNullException">
        /// dbContextfactory
        /// or
        /// MasterDbContext - Master database context cannot be null
        /// </exception>
        /// <autogeneratedoc />
        public UnitOfWork(IDatabaseContextFactory dbContextfactory)
        {
            if (dbContextfactory == null)
            {
                throw new ArgumentNullException(nameof(dbContextfactory));
            }

            var MasterDbContext = dbContextfactory.MasterDbContext();

            if (MasterDbContext == null)
            {
                throw new ArgumentNullException(nameof(MasterDbContext), @"Master database context cannot be null");
            }

            DatabaseContext = MasterDbContext;
        }

        /// <summary>
        /// Gets the database context. DatabaseContext is part of EF and itself is implementation of UoW (and repo) patterns
        /// </summary>
        /// <value>
        /// The database context.
        /// </value>
        /// <remarks>
        /// If true  UoW was implemented this wouldn't be here, but we are exposing this for simplicity sake.
        /// For example so that repository  could use benefits of DbContext and DbSet <see cref="DbSet" />. One of those benefits are Find and FindAsnyc methods
        /// </remarks>
        /// <autogeneratedoc />
        public DbContext DatabaseContext { get; }

        /// <inheritdoc />
        /// <summary>
        /// Commits the changes to database
        /// </summary>
        /// <autogeneratedoc />
        public void Commit()
        {
            DatabaseContext.SaveChanges();
        }

        /// <inheritdoc />
        /// <summary>
        /// Asynchronously commits changes to database.
        /// </summary>
        /// <returns></returns>
        /// <autogeneratedoc />
        public async Task CommitAsync()
        {
            await DatabaseContext.SaveChangesAsync();
        }


        /// <inheritdoc />
        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        /// <autogeneratedoc />
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Releases unmanaged and - optionally - managed resources.
        /// </summary>
        /// <param name="disposning"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
        /// <autogeneratedoc />
        protected virtual void Dispose(bool disposning)
        {
            if (_disposed)
                return;


            if (disposning)
            {
                DatabaseContext.Dispose();
            }


            _disposed = true;
        }

        /// <summary>
        /// Finalizes an instance of the <see cref="UnitOfWork"/> class.
        /// </summary>
        /// <autogeneratedoc />
        ~UnitOfWork()
        {
            Dispose(false);
        }

    }
}