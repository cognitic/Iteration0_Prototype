using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Infrastructure;
using Iteration0.Business.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Iteration0.Business.Domain
{
    /// <summary>
    ////Business
    ////	Domain
    ////		Entities
    ////			*<entity> (+ *aggregation properties)
    ////		Aggregates
    ////			*<root> (+ *aggregation properties)
    ////	    Factories
    ////		    *BehaviorFactory based on ConfigurationService
    ////	Infrastructure
    ////		ConfigurationLoader 
    ////	Services
    ////		ConfigurationService ( + AlternativeConfigurationLoader(_default.xml))
    ////		*<root>Service (+ *children behaviors + *<Infrastructures>Service)
    ////		*<Infrastructures>Service 
    ////	Interfaces
    ////		IBehavior
    ////		IService
    ////		IRepository
    /////ConfigurationFiles
    ////	    _default.xml
    ////	    *<alternative>.xml
    /// </summary>
    public class BusinessLayerScaffold
    {
        public TemporaryFolder Folder { get; set; }
        public String AggregateFolderRelativePath { get; set; } = "\\Business\\Domain\\Aggregates\\";
        public String EntityFolderRelativePath { get; set; } = "\\Business\\Domain\\Entities\\";
        public String FactoryFolderRelativePath { get; set; } = "\\Business\\Domain\\Factories\\";
        public String InfrastructureFolderRelativePath { get; set; } = "\\Business\\Infrastructure\\";
        public String InterfaceFolderRelativePath { get; set; } = "\\Business\\Interfaces\\";
        public String ServiceFolderRelativePath { get; set; } = "\\Business\\Services\\";
        public String ConfigurationFolderRelativePath { get; set; } = "\\ConfigFiles\\";
        public List<DomainConceptFacade> ConceptList { get; set; }
        public List<RessourceDefinition> InfrastructureList { get; set; }
        public List<RessourceAssociation> AggregationList { get; set; }
        public List<RessourceRequirement> BehaviorList { get; set; }
        public List<ProjectContext> VariantList { get; set; }
        public List<ConceptScaffoldModel> AggregateScaffoldList { get; set; }
        public List<ConceptScaffoldModel> EntityScaffoldList { get; set; }
        public List<FactoryScaffoldModel> FactoryScaffoldList { get; set; }
        public List<ConfigurationScaffoldModel> ConfigurationList { get; set; }


        public BusinessLayerScaffold(List<DomainConceptFacade> concepts, List<RessourceDefinition> infrastructures, List<RessourceAssociation> aggregations, List<RessourceRequirement> behaviors, List<ProjectContext> variants, TemporaryFolder workingFolder)
        {
            Folder = workingFolder;
            ConceptList = concepts;
            InfrastructureList = infrastructures;
            AggregationList = aggregations;
            BehaviorList = behaviors;
            VariantList = variants;

            //TODO variant CodeName combinaisons
            ConfigurationList = new List<ConfigurationScaffoldModel>();
            ConfigurationList.Add(new ConfigurationScaffoldModel("Default"));
            foreach (ProjectContext variant in VariantList)
            {
                var config = new ConfigurationScaffoldModel(variant.CodeName);
                config.CodeNameList.Add(variant.CodeName);
                config.CodeNameIdList.Add(variant.Id);                
                ConfigurationList.Add(config);
            }

            FactoryScaffoldList = new List<FactoryScaffoldModel>();
            AggregateScaffoldList = new List<ConceptScaffoldModel>();
            EntityScaffoldList = new List<ConceptScaffoldModel>();
            foreach (DomainConceptFacade ress in ConceptList)
            {
                var scaffold = new ConceptScaffoldModel(ress.Definition.Id, ress.Definition.Name);
                IEnumerable<RessourceAssociation> conceptAggregations = aggregations.Where(c => c.Parent.Id == ress.Definition.Id);
                var HasOneRessourceIds = conceptAggregations.Where(c => c.AssociationEnumType == (short)AssociationEnumType.HasOne).Select(r => r.Ressource.Id).ToList();
                scaffold.HasOneAggregation = ConceptList.Where(c => HasOneRessourceIds.Contains(c.Definition.Id)).ToList();
                var HasManyRessourceIds = conceptAggregations.Where(c =>  c.AssociationEnumType == (short)AssociationEnumType.HasMany).Select(r => r.Ressource.Id).ToList();
                scaffold.HasManyAggregation = ConceptList.Where(c => HasManyRessourceIds.Contains(c.Definition.Id)).ToList();

                List<RessourceRequirement> conceptBehaviors = BehaviorList.Where(c => c.Concept.Id == ress.Definition.Id).ToList();
                scaffold.DefaultBehaviorList = conceptBehaviors.Where(c => c.RequirementEnumType == (short)RequirementEnumType.Default).ToList();
                scaffold.AlternativeBehaviorList = conceptBehaviors.Where(c => c.IsAlternative).ToList();
                if (scaffold.AlternativeBehaviorList.Count > 0)
                {
                    var DefaultBehaviorIDs = scaffold.AlternativeBehaviorList.Select(x => x.DefaultBehavior.Id).Distinct().ToList();
                    foreach (int behaviorID in DefaultBehaviorIDs)
                    {
                        var DefaultBehavior = scaffold.DefaultBehaviorList.Where(x => x.Id == behaviorID).First() ;
                        var factory = new FactoryScaffoldModel(behaviorID, DefaultBehavior.Behavior);
                        factory.AlternativeBehaviorList = scaffold.AlternativeBehaviorList.Where(x => x.Id == behaviorID).ToList();
                        foreach (ConfigurationScaffoldModel config in ConfigurationList)
                        {
                            foreach (RessourceRequirement altBehavior in factory.AlternativeBehaviorList)
                            {
                                foreach (ProjectContext variant in altBehavior.Variants)
                                {
                                    if (config.CodeNameIdList.ToArray().Contains(variant.Id))
                                    {
                                        config.SelectedBehaviors.Add(behaviorID,altBehavior.Id);
                                    }
                                    else
                                    {
                                        config.SelectedBehaviors.Add(behaviorID, behaviorID);//Default
                                    }
                                }
                            }
                        }
                        scaffold.AlternativeFactoryList.Add(factory);
                    }
                    scaffold.DefaultBehaviorList = scaffold.DefaultBehaviorList.Where((x => !DefaultBehaviorIDs.Contains(x.Id))).ToList();//Clean up
                }
                if (ress.Definition.ScaleOrder == 1)
                {
                    AggregateScaffoldList.Add(scaffold);
                }
                else
                {
                    EntityScaffoldList.Add(scaffold);
                }
            }
        }

        public void BuildAll()
        {
            BuildAggregates();
            BuildEntities();
            BuildBehaviorFactories();
            BuildInfrastructuresServices();
            BuildConfigurationFiles();
        }

        public void BuildEntities()
        {
            ////			*<entity> (+ *aggregation properties)

            foreach (ConceptScaffoldModel scaffold in EntityScaffoldList)
            {
                IList<string> scaffoldLines = new List<string>()
                {
                    "NameSpace",
                    "",
                    "////Comment",
                    "Public Class "+ scaffold.Name,
                    "{",
                    "",
                    "}",
                };
                File.WriteAllLines(Folder.RootPath + EntityFolderRelativePath + scaffold.Name + ".cs", scaffoldLines);
            }
        }
        public void BuildAggregates()
        {
            ////			*<root> (+ *aggregation properties) + ExposedBehavior + iRepository + iService
            foreach (ConceptScaffoldModel scaffold in AggregateScaffoldList)
            {
                IList<string> scaffoldLines = new List<string>()
                {
                    "NameSpace",
                    "",
                    "////Comment",
                    "Public Class "+ scaffold.Name,
                    "{",
                    "",
                    "}",
                };
                File.WriteAllLines(Folder.RootPath + EntityFolderRelativePath + scaffold.Name + ".cs", scaffoldLines);
            }
        }
        public void BuildBehaviorFactories()
        {
            ////		*BehaviorFactories + Behaviors + IBehavior            
            //businessConfiguration
            //all Key With defaultValue
            //public Class xxxBehaviorFactory { }
            //behaviorConfigurationKey
            //protected void xxxBehaviorFactory(businessConfiguration)
            //{
            //    switch behaviorConfigurationKey
            //     return behavior = PropertiesUtil.toString(config.get("test", "some default");
            //}
            //protected void GetBehavior() : xxxBehavior {
            //	switch behaviorConfigurationKey
            //     return behavior = PropertiesUtil.toString(config.get("test","some default");
            //}
            //ConfigureXXXBehavior(xxxBehaviorFactory)

            foreach (FactoryScaffoldModel scaffold in FactoryScaffoldList)
            {
                IList<string> scaffoldLines = new List<string>()
                {
                    "NameSpace",
                    "",
                    "////Comment",
                    "Public Class "+ scaffold.Name,
                    "{",
                    "",
                    "}",
                };
                File.WriteAllLines(Folder.RootPath + EntityFolderRelativePath + scaffold.Name + ".cs", scaffoldLines);
            }
        }
        public void BuildInfrastructuresServices()
        {
            ////		*<Infrastructures>Service 
            foreach (RessourceDefinition ress in InfrastructureList)
            {
                var Name = String.Join("", Regex.Split(ress.Name, @"\s+"));
                Name = Name.First().ToString().ToUpper() + Name.Substring(1).ToLower();
                IList<string> scaffoldLines = new List<string>()
                {
                    "NameSpace",
                    "",
                    "////Comment",
                    "Public Class "+ Name,
                    "{",
                    "",
                    "}",
                };
                File.WriteAllLines(Folder.RootPath + ServiceFolderRelativePath + Name + ".cs", scaffoldLines);
            }
        }
        public void BuildConfigurationFiles()
        {
            ////	    _default.xml
            ////	    *<alternative>.xml
            foreach (ConfigurationScaffoldModel config in ConfigurationList)
            {
                IList<string> scaffoldLines = new List<string>()
            {
                "line1",
                "line2",
                "line3",
            };
                File.WriteAllLines(Folder.RootPath + ConfigurationFolderRelativePath + config.Name.ToString() + ".xml", scaffoldLines);
            }
        }

    }

    public class ConfigurationScaffoldModel
    {
        public List<FactoryScaffoldModel> AlternativeFactoryList { get; set; } = new List<FactoryScaffoldModel>();
        public Dictionary<int,int> SelectedBehaviors { get; set; } = new Dictionary<int, int>();        
        public List<String> CodeNameList { get; set; } = new List<String>();
        public List<int> CodeNameIdList { get; set; } = new List<int>();        
        public String Name { get; set; }

        public ConfigurationScaffoldModel(String ConfigurationName)
        {
            ConfigurationName = String.Join("", Regex.Split(ConfigurationName, @"\s+"));
            Name = TextFormatter.SetCamelCaseOn(ConfigurationName) + "Config";
        }

    }
    public class ConceptScaffoldModel
    {
        public int ID { get; set; }
        public String Name { get; set; }
        public List<RessourceRequirement> DefaultBehaviorList { get; set; } = new List<RessourceRequirement>();
        public List<RessourceRequirement> AlternativeBehaviorList { get; set; } = new List<RessourceRequirement>();
        public List<FactoryScaffoldModel> AlternativeFactoryList { get; set; } = new List<FactoryScaffoldModel>();
        public List<DomainConceptFacade> HasOneAggregation { get; set; } = new List<DomainConceptFacade>();
        public List<DomainConceptFacade> HasManyAggregation { get; set; } = new List<DomainConceptFacade>();

        public ConceptScaffoldModel(int ConceptID, String ConceptName)
        {
            ID = ConceptID;
            ConceptName = String.Join("", Regex.Split(ConceptName, @"\s+"));
            Name = TextFormatter.SetCamelCaseOn(ConceptName);
        }
    }
    public class FactoryScaffoldModel
    {
        public String Name { get; set; }
        public int DefaultBehaviorID { get; set; }
        public String DefaultBehaviorName { get; set; }
        public List<RessourceRequirement> AlternativeBehaviorList { get; set; } = new List<RessourceRequirement>();

        public FactoryScaffoldModel(int BehaviorID, String BehaviorName)
        {
            BehaviorName = String.Join("", Regex.Split(BehaviorName, @"\s+"));
            Name = BehaviorName.First().ToString().ToUpper() + BehaviorName.Substring(1).ToLower();
            DefaultBehaviorID = BehaviorID;
            DefaultBehaviorName = TextFormatter.SetCamelCaseOn(BehaviorName.ToLower());
        }

    }

    
}

