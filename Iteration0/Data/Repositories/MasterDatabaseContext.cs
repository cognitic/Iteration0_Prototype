using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain.Entities;


namespace Iteration0.Data.Repositories
{
    public class MasterDatabaseContext : DbContext
    {
        public DbSet<ProjectDefinition> ProjectDefinitions { get; set; }
        public DbSet<ProjectContext> ProjectContexts { get; set; }
        public DbSet<ProjectContextType> ProjectContextTypes { get; set; }
        public DbSet<RessourceRequirement> RessourceRequirements { get; set; }
        //public DbSet<RequiremenContext> RequiremenContexts { get; set; }
        public DbSet<RessourceAssociation> RessourceAssociations { get; set; }
        public DbSet<RessourceDefinition> RessourceDefinitions { get; set; }

        public MasterDatabaseContext() : base("DB_Iteration0_ConnectionString")
        {
            Database.SetInitializer<MasterDatabaseContext>(new CreateDatabaseIfNotExists<MasterDatabaseContext>());

            //Database.SetInitializer<MasterDatabaseContext>(new DropCreateDatabaseIfModelChanges<MasterDatabaseContext>());
            //Database.SetInitializer<MasterDatabaseContext>(new DropCreateDatabaseAlways<MasterDatabaseContext>());
            //Database.SetInitializer<MasterDatabaseContext>(new MasterDatabaseInitializer());
            //http://www.entityframeworktutorial.net/code-first/database-initialization-strategy-in-code-first.aspx
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
    public class MasterDatabaseInitializer : CreateDatabaseIfNotExists<MasterDatabaseContext>
    {
        protected override void Seed(MasterDatabaseContext context)
        {
            base.Seed(context);
        }
    }
}