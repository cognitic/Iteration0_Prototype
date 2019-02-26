namespace Iteration0.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ProjectContext",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        CodeName = c.String(),
                        Comment = c.String(),
                        SortOrder = c.Short(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Project_Id = c.Int(),
                        Type_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProjectDefinition", t => t.Project_Id)
                .ForeignKey("dbo.ProjectContextType", t => t.Type_Id)
                .Index(t => t.Project_Id)
                .Index(t => t.Type_Id);
            
            CreateTable(
                "dbo.ProjectDefinition",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        CodeName = c.String(),
                        Brief = c.String(),
                        OwnedBy = c.Int(nullable: false),
                        IsPrivateOnly = c.Boolean(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ProjectContextType",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        ContextEnumType = c.Short(nullable: false),
                        ScaleOrder = c.Short(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Project_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProjectDefinition", t => t.Project_Id)
                .Index(t => t.Project_Id);
            
            CreateTable(
                "dbo.Event",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        EventEnumType = c.Short(nullable: false),
                        ActionDate = c.DateTime(nullable: false),
                        ActionBy = c.Int(nullable: false),
                        ActionLog = c.String(),
                        Requirement_Id = c.Int(),
                        Ressource_Id = c.Int(),
                        ProjectDefinition_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.RessourceRequirement", t => t.Requirement_Id)
                .ForeignKey("dbo.RessourceDefinition", t => t.Ressource_Id)
                .ForeignKey("dbo.ProjectDefinition", t => t.ProjectDefinition_Id)
                .Index(t => t.Requirement_Id)
                .Index(t => t.Ressource_Id)
                .Index(t => t.ProjectDefinition_Id);
            
            CreateTable(
                "dbo.RessourceRequirement",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RequirementEnumType = c.Short(nullable: false),
                        Priority = c.Int(nullable: false),
                        Title = c.String(),
                        Description = c.String(),
                        Attribute1Value = c.String(),
                        Attribute2Value = c.String(),
                        Attribute3Value = c.String(),
                        Attribute4Value = c.String(),
                        Attribute5Value = c.String(),
                        IsEnabled = c.Boolean(nullable: false),
                        SortOrder = c.Int(nullable: false),
                        WorkItemURL = c.String(),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Ressource_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.RessourceDefinition", t => t.Ressource_Id)
                .Index(t => t.Ressource_Id);
            
            CreateTable(
                "dbo.RessourceDefinition",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        RessourceEnumType = c.Short(nullable: false),
                        Definition = c.String(),
                        ScaleOrder = c.Short(nullable: false),
                        StepOrder = c.Short(nullable: false),
                        SortOrder = c.Int(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Context_Id = c.Int(),
                        Project_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProjectContext", t => t.Context_Id)
                .ForeignKey("dbo.ProjectDefinition", t => t.Project_Id)
                .Index(t => t.Context_Id)
                .Index(t => t.Project_Id);
            
            CreateTable(
                "dbo.RessourceAssociation",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AssociationEnumType = c.Short(nullable: false),
                        CustomName = c.String(),
                        SortOrder = c.Int(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Parent_Id = c.Int(),
                        Ressource_Id = c.Int(),
                        RessourceDefinition_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.RessourceDefinition", t => t.Parent_Id)
                .ForeignKey("dbo.RessourceDefinition", t => t.Ressource_Id)
                .ForeignKey("dbo.RessourceDefinition", t => t.RessourceDefinition_Id)
                .Index(t => t.Parent_Id)
                .Index(t => t.Ressource_Id)
                .Index(t => t.RessourceDefinition_Id);
            
            CreateTable(
                "dbo.ProjectVersion",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        NumberName = c.String(),
                        NickName = c.String(),
                        Summary = c.String(),
                        VersionEnumType = c.Short(nullable: false),
                        ReleasedMonth = c.Short(nullable: false),
                        ReleasedYear = c.Int(nullable: false),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Product_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProjectProduct", t => t.Product_Id)
                .Index(t => t.Product_Id);
            
            CreateTable(
                "dbo.ProjectProduct",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Mission = c.String(),
                        IsEnabled = c.Boolean(nullable: false),
                        UpdatedDate = c.DateTime(nullable: false),
                        UpdatedBy = c.Int(nullable: false),
                        Project_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProjectDefinition", t => t.Project_Id)
                .Index(t => t.Project_Id);
            
            CreateTable(
                "dbo.RessourceRequirementProjectContext",
                c => new
                    {
                        RessourceRequirement_Id = c.Int(nullable: false),
                        ProjectContext_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.RessourceRequirement_Id, t.ProjectContext_Id })
                .ForeignKey("dbo.RessourceRequirement", t => t.RessourceRequirement_Id, cascadeDelete: true)
                .ForeignKey("dbo.ProjectContext", t => t.ProjectContext_Id, cascadeDelete: true)
                .Index(t => t.RessourceRequirement_Id)
                .Index(t => t.ProjectContext_Id);
            
            CreateTable(
                "dbo.ProjectVersionRessourceRequirement",
                c => new
                    {
                        ProjectVersion_Id = c.Int(nullable: false),
                        RessourceRequirement_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.ProjectVersion_Id, t.RessourceRequirement_Id })
                .ForeignKey("dbo.ProjectVersion", t => t.ProjectVersion_Id, cascadeDelete: true)
                .ForeignKey("dbo.RessourceRequirement", t => t.RessourceRequirement_Id, cascadeDelete: true)
                .Index(t => t.ProjectVersion_Id)
                .Index(t => t.RessourceRequirement_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Event", "ProjectDefinition_Id", "dbo.ProjectDefinition");
            DropForeignKey("dbo.Event", "Ressource_Id", "dbo.RessourceDefinition");
            DropForeignKey("dbo.Event", "Requirement_Id", "dbo.RessourceRequirement");
            DropForeignKey("dbo.ProjectVersionRessourceRequirement", "RessourceRequirement_Id", "dbo.RessourceRequirement");
            DropForeignKey("dbo.ProjectVersionRessourceRequirement", "ProjectVersion_Id", "dbo.ProjectVersion");
            DropForeignKey("dbo.ProjectVersion", "Product_Id", "dbo.ProjectProduct");
            DropForeignKey("dbo.ProjectProduct", "Project_Id", "dbo.ProjectDefinition");
            DropForeignKey("dbo.RessourceRequirement", "Ressource_Id", "dbo.RessourceDefinition");
            DropForeignKey("dbo.RessourceDefinition", "Project_Id", "dbo.ProjectDefinition");
            DropForeignKey("dbo.RessourceDefinition", "Context_Id", "dbo.ProjectContext");
            DropForeignKey("dbo.RessourceAssociation", "RessourceDefinition_Id", "dbo.RessourceDefinition");
            DropForeignKey("dbo.RessourceAssociation", "Ressource_Id", "dbo.RessourceDefinition");
            DropForeignKey("dbo.RessourceAssociation", "Parent_Id", "dbo.RessourceDefinition");
            DropForeignKey("dbo.RessourceRequirementProjectContext", "ProjectContext_Id", "dbo.ProjectContext");
            DropForeignKey("dbo.RessourceRequirementProjectContext", "RessourceRequirement_Id", "dbo.RessourceRequirement");
            DropForeignKey("dbo.ProjectContextType", "Project_Id", "dbo.ProjectDefinition");
            DropForeignKey("dbo.ProjectContext", "Type_Id", "dbo.ProjectContextType");
            DropForeignKey("dbo.ProjectContext", "Project_Id", "dbo.ProjectDefinition");
            DropIndex("dbo.ProjectVersionRessourceRequirement", new[] { "RessourceRequirement_Id" });
            DropIndex("dbo.ProjectVersionRessourceRequirement", new[] { "ProjectVersion_Id" });
            DropIndex("dbo.RessourceRequirementProjectContext", new[] { "ProjectContext_Id" });
            DropIndex("dbo.RessourceRequirementProjectContext", new[] { "RessourceRequirement_Id" });
            DropIndex("dbo.ProjectProduct", new[] { "Project_Id" });
            DropIndex("dbo.ProjectVersion", new[] { "Product_Id" });
            DropIndex("dbo.RessourceAssociation", new[] { "RessourceDefinition_Id" });
            DropIndex("dbo.RessourceAssociation", new[] { "Ressource_Id" });
            DropIndex("dbo.RessourceAssociation", new[] { "Parent_Id" });
            DropIndex("dbo.RessourceDefinition", new[] { "Project_Id" });
            DropIndex("dbo.RessourceDefinition", new[] { "Context_Id" });
            DropIndex("dbo.RessourceRequirement", new[] { "Ressource_Id" });
            DropIndex("dbo.Event", new[] { "ProjectDefinition_Id" });
            DropIndex("dbo.Event", new[] { "Ressource_Id" });
            DropIndex("dbo.Event", new[] { "Requirement_Id" });
            DropIndex("dbo.ProjectContextType", new[] { "Project_Id" });
            DropIndex("dbo.ProjectContext", new[] { "Type_Id" });
            DropIndex("dbo.ProjectContext", new[] { "Project_Id" });
            DropTable("dbo.ProjectVersionRessourceRequirement");
            DropTable("dbo.RessourceRequirementProjectContext");
            DropTable("dbo.ProjectProduct");
            DropTable("dbo.ProjectVersion");
            DropTable("dbo.RessourceAssociation");
            DropTable("dbo.RessourceDefinition");
            DropTable("dbo.RessourceRequirement");
            DropTable("dbo.Event");
            DropTable("dbo.ProjectContextType");
            DropTable("dbo.ProjectDefinition");
            DropTable("dbo.ProjectContext");
        }
    }
}
