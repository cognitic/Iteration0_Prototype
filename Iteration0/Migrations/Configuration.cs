namespace Iteration0.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Business.Domain.Entities;
    using Iteration0.Business.Services;

    //NB: This miggrations folder was created via  PM Console Command : enable-migrations -contexttypename MasterDatabaseContext
    //DB Migration file command : add-migration InitialCreate -verbose -ProjectName "Iteration0" -Force
    //DB Creation : update-database
    internal sealed class Configuration : DbMigrationsConfiguration<Iteration0.Data.Repositories.MasterDatabaseContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        //protected override void Seed(Iteration0.Data.Repositories.MasterDatabaseContext context)
        //{
        //    //context.ProjectContextTypes.AddOrUpdate(
        //    //      new ProjectContextType {Project = null, Name = "DomainContext", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.DomainContext },
        //    //      new ProjectContextType { Project = null, Name = "BusinessProcess", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.BusinessProcess },
        //    //      new ProjectContextType { Project = null, Name = "ComponentType", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.Feature }
        //    //    );            
        //}
    }
}
