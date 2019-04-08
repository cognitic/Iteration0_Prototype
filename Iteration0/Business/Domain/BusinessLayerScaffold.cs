using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Infrastructure;
using Iteration0.Business.Services;
using Iteration0.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Iteration0.Business.Domain
{
    public class  BusinessLayerScaffold
    {
        public TemporaryFolder ScaffoldFolder { get; set; }
        public String AggregateFolderRelativePath { get; set; } = "\\Business\\Domain\\Aggregates\\";
        public String EntityFolderRelativePath { get; set; } = "\\Business\\Domain\\Entities\\";
        public String FactoryFolderRelativePath { get; set; } = "\\Business\\Domain\\Factories\\";
        public String SpecificationFolderRelativePath { get; set; } = "\\Business\\Domain\\Specifications\\";
        public String InfrastructureFolderRelativePath { get; set; } = "\\Business\\Infrastructure\\";
        public String InterfaceFolderRelativePath { get; set; } = "\\Business\\Interfaces\\";
        public String ServiceFolderRelativePath { get; set; } = "\\Business\\Services\\";
        public String ConfigurationFolderRelativePath { get; set; } = "\\ConfigFiles\\";
        public List<DomainConceptFacade> ConceptList { get; set; }
        public AnalysisMatrixViewModel SpecificationsMatrixVM { get; set; }
        public List<RessourceDefinition> InfrastructureList { get; set; }
        public List<RessourceAssociation> AggregationList { get; set; }
        public List<ServiceScaffoldModel> ServiceScaffoldList { get; set; }
        public List<ConceptScaffoldModel> AggregateScaffoldList { get; set; }
        public List<ConceptScaffoldModel> EntityScaffoldList { get; set; }
        public List<SpecificationFactoryScaffoldModel> FactoryScaffoldList { get; set; }
        public List<SpecificationScaffoldModel> SpecificationScaffoldList { get; set; }
        public List<ConfigurationScaffoldModel> ConfigurationList { get; set; }
        public List<RessourceRequirement> DefaultSpecifications { get; set; }
        public List<RessourceRequirement> AlternativeSpecifications { get; set; }


        public BusinessLayerScaffold(List<DomainConceptFacade> concepts, List<RessourceDefinition> infrastructures, List<RessourceAssociation> aggregations, List<RessourceRequirement> allSpecifications, AnalysisMatrixViewModel SpecificationsMatrix, TemporaryFolder workingFolder)
        {
            ScaffoldFolder = workingFolder;
            ConceptList = concepts;
            InfrastructureList = infrastructures;
            AggregationList = aggregations;
            SpecificationsMatrixVM = SpecificationsMatrix;
            DefaultSpecifications = allSpecifications.Where(c => c.RequirementEnumType == (short)RequirementEnumType.Default).ToList();
            AlternativeSpecifications = allSpecifications.Where(c => c.IsAlternative).ToList();
            BuildConfigurationScaffolds();
            BuildDomainScaffolds();
            BuildServiceScaffolds();
        }

        /// <summary>
        ////Business
        ////	Domain
        ////		Entities
        ////			*<entity> (+ *aggregation properties)
        ////		Aggregates
        ////			*<root> (+ *aggregation properties)
        ////	    Factories
        ////		    *SpecificationFactory based on ConfigurationService
        ////	    Specifications
        ////		    *Specification Models
        ////	Infrastructure
        ////		ConfigurationLoader 
        ////	Services
        ////		Services 
        ////	Interfaces
        ////		IFactory
        ////		ISpecification
        ////		IService
        ////		IRepository
        /////ConfigurationFiles
        ////	    <alternative>Config.xml
        /// </summary>
        public void GenerateAllFiles()
        {
            GenerateFilesForAggregates();
            GenerateFilesForEntities();
            GenerateFilesForSpecificationFactories();
            GenerateFilesForSpecifications();
            GenerateFilesForServices();
            GenerateFilesForInfrastructureFiles();
            GenerateFilesForInterfaces();
            GenerateFilesForConfigurationFiles();
        }

        public void GenerateFilesForInterfaces()
        {
            foreach (ServiceScaffoldModel scaffold in ServiceScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + InterfaceFolderRelativePath + "I" + scaffold.Name + ".cs", scaffold.AsInterfaceTextLines());
            }
            foreach (ConceptScaffoldModel scaffold in AggregateScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + InterfaceFolderRelativePath + "I" + scaffold.Name + "Repository.cs", scaffold.AsRepositoryInterfaceTextLines());
            }
            foreach (SpecificationFactoryScaffoldModel scaffold in FactoryScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + InterfaceFolderRelativePath + "I" + scaffold.Name + ".cs", scaffold.AsInterfaceTextLines());
                foreach (KeyValuePair<int, List<SpecificationScaffoldModel>> Specification in scaffold.SpecificationsDictionary)
                {
                    File.WriteAllLines(ScaffoldFolder.RootPath + InterfaceFolderRelativePath  + Specification.Value[0].Interface + ".cs", Specification.Value[0].AsInterfaceTextLines());
                }
            }
        }

        public void GenerateFilesForEntities()
        {
            foreach (ConceptScaffoldModel scaffold in EntityScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + EntityFolderRelativePath + scaffold.Name + ".cs", scaffold.AsTextLines());
            }
        }

        public void GenerateFilesForAggregates()
        {
            foreach (ConceptScaffoldModel scaffold in AggregateScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + AggregateFolderRelativePath + scaffold.AggregateName + ".cs", scaffold.AsTextLines(true));
            }
        }

        public void GenerateFilesForSpecificationFactories()
        {
            foreach (SpecificationFactoryScaffoldModel scaffold in FactoryScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + FactoryFolderRelativePath + scaffold.Name + ".cs", scaffold.AsTextLines());
            }
        }
        public void GenerateFilesForSpecifications()
        {
            foreach (SpecificationScaffoldModel scaffold in SpecificationScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + SpecificationFolderRelativePath + scaffold.Name + ".cs", scaffold.AsTextLines());
            }
        }

        public void GenerateFilesForServices()
        {
            foreach (ServiceScaffoldModel scaffold in ServiceScaffoldList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + ServiceFolderRelativePath + scaffold.Name + ".cs", scaffold.AsTextLines());
            }
        }

        public void GenerateFilesForConfigurationFiles()
        {
            foreach (ConfigurationScaffoldModel scaffold in ConfigurationList)
            {
                File.WriteAllLines(ScaffoldFolder.RootPath + ConfigurationFolderRelativePath + scaffold.Name + ".xml", scaffold.AsTextLines());
            }
        }

        public void GenerateFilesForInfrastructureFiles()
        {
            var scaffoldAsTextLines = new List<string>()
                {
                    "namespace MyNameSpace.Business.Infrastructure",
                    "{",
                    "/// <summary>",
                    "/// class ConfigurationLoader",
                    "/// Responsability: Load Configuration Keys Value",
                    "/// </summary>",
                    "public class ConfigurationLoader",
                    "{",
                    "}",
                    "}",
                };
            File.WriteAllLines(ScaffoldFolder.RootPath + InfrastructureFolderRelativePath + "ConfigurationLoader.cs", scaffoldAsTextLines);
        }

        public void BuildConfigurationScaffolds()
        {
            var alternativeDefaultRequirementIds = AlternativeSpecifications.Select(x => x.DefaultBehavior.Id).ToList();
            var defaultSpecificationsWithAlternatives = DefaultSpecifications.Where(x => alternativeDefaultRequirementIds.Contains(x.Id)).ToList();

            ConfigurationList = new List<ConfigurationScaffoldModel>();
            //ConfigurationList.Add(new ConfigurationScaffoldModel("Default"));
            foreach (ProductAlternativeViewModel alternative in SpecificationsMatrixVM.ProductAlternatives)
            {
                var config = new ConfigurationScaffoldModel(alternative.ScopeSummary);
                foreach (RessourceRequirement defaultSpecification in defaultSpecificationsWithAlternatives)
                {
                        SpecificationViewModel configAlternativeSpecification = null;
                        foreach (SpecificationViewModel alternativeSpecification in alternative.AlternativeSpecifications)
                        {
                            if (alternativeSpecification.DefaultSpecificationID == defaultSpecification.Id) { configAlternativeSpecification = alternativeSpecification; break; }
                        }
                        if (configAlternativeSpecification == null)
                        {
                            config.AddSpecification(defaultSpecification.Id, defaultSpecification.Behavior, "DefaultSpecification");
                        }
                        else
                        {
                            config.AddSpecification(defaultSpecification.Id, defaultSpecification.Behavior, configAlternativeSpecification.Name + "Specification");
                        }
                }
                ConfigurationList.Add(config);
            }
        }
        public void BuildDomainScaffolds()
        {
            AggregateScaffoldList = new List<ConceptScaffoldModel>();
            EntityScaffoldList = new List<ConceptScaffoldModel>();
            FactoryScaffoldList = new List<SpecificationFactoryScaffoldModel>();
            SpecificationScaffoldList = new List<SpecificationScaffoldModel>();
            foreach (DomainConceptFacade ress in ConceptList)
            {
                var scaffold = new ConceptScaffoldModel(ress.Definition.Id, ress.Definition.Name);
                var defaultSpecificationList = DefaultSpecifications.Where(c => c.Concept.Id == ress.Definition.Id).ToList();
                var alternativeSpecificationList = AlternativeSpecifications.Where(c => c.Concept.Id == ress.Definition.Id).ToList();
                foreach (RessourceRequirement defaultSpecification in defaultSpecificationList)
                {
                    var specification = new SpecificationScaffoldModel(defaultSpecification.Id, defaultSpecification.Behavior, defaultSpecification.Description, null);
                    var SpecificationAlternativeSpecificationList = alternativeSpecificationList.Where(c => c.DefaultBehavior.Id == defaultSpecification.Id).ToList();
                    if (SpecificationAlternativeSpecificationList.Count> 0)
                    {
                        specification.Interface = "I" + specification.Name;
                        if (scaffold.AlternativeSpecificationFactory == null) scaffold.AlternativeSpecificationFactory = new SpecificationFactoryScaffoldModel(scaffold.ID, scaffold.Name);
                        scaffold.AlternativeSpecificationFactory.AddDefaultSpecification(defaultSpecification.Id, specification);
                        foreach (RessourceRequirement factorySpecification in SpecificationAlternativeSpecificationList)
                        {
                            var altSpecification = new SpecificationScaffoldModel(factorySpecification.Id, factorySpecification.Behavior, factorySpecification.Description, specification.Interface);
                            scaffold.AlternativeSpecificationFactory.AddAlternativeSpecification(defaultSpecification.Id, altSpecification);
                            SpecificationScaffoldList.Add(altSpecification);
                        }
                        SpecificationScaffoldList.Add(specification);
                    } else
                    {
                        scaffold.SingleSpecificationList.Add(specification);
                        SpecificationScaffoldList.Add(specification);
                    }
                    if (scaffold.AlternativeSpecificationFactory != null) FactoryScaffoldList.Add(scaffold.AlternativeSpecificationFactory);
                }
                if (ress.Definition.ScaleOrder == 1)
                {
                    AggregateScaffoldList.Add(scaffold);
                }
                EntityScaffoldList.Add(scaffold);//Aggregate root is an entity
            }
            //Add level concept aggregations
            foreach (ConceptScaffoldModel scaffold in EntityScaffoldList)
            {
                IEnumerable<RessourceAssociation> conceptAggregations = AggregationList.Where(c => c.Parent.Id == scaffold.ID);
                var HasOneRessourceIds = conceptAggregations.Where(c => c.AssociationEnumType == (short)AssociationEnumType.HasOne).Select(r => r.Ressource.Id).ToList();
                scaffold.HasOneAggregation = EntityScaffoldList.Where(c => HasOneRessourceIds.Contains(c.ID)).ToList();
                var HasManyRessourceIds = conceptAggregations.Where(c => c.AssociationEnumType == (short)AssociationEnumType.HasMany).Select(r => r.Ressource.Id).ToList();
                scaffold.HasManyAggregation = EntityScaffoldList.Where(c => HasManyRessourceIds.Contains(c.ID)).ToList();
            }
        }

        public void BuildServiceScaffolds()
        {
            ServiceScaffoldList = new List<ServiceScaffoldModel>();
            foreach (ConceptScaffoldModel scaffold in AggregateScaffoldList)
            {
                ServiceScaffoldList.Add(new ServiceScaffoldModel(scaffold.ID, scaffold.Name, scaffold));
            }
            foreach (RessourceDefinition ress in InfrastructureList)
            {
                ServiceScaffoldList.Add(new ServiceScaffoldModel(ress.Id, ress.Name, null));
            }
        }
    }

    public class  ConfigurationScaffoldModel
    {
        public Dictionary<int, List<String>> SpecificationsDictionary { get; set; } = new Dictionary<int, List<String>>();
        public String Name { get; set; }

        //TODO Use CodeName in ConfigurationName
        public ConfigurationScaffoldModel(String ConfigurationName)
        {
            Name = TextFormatter.SetCamelCaseOn(ConfigurationName) + "Config";
        }

        public void AddSpecification(int SpecificationId, String SpecificationKeyName, String SpecificationValueName)
        {
            SpecificationKeyName = TextFormatter.SetCamelCaseOn(SpecificationKeyName);
            SpecificationValueName = TextFormatter.SetCamelCaseOn(SpecificationValueName);
            SpecificationsDictionary.Add(SpecificationId, new List<String>(){ SpecificationKeyName, SpecificationValueName});
        }

        public IList<string> AsTextLines()
        {
            var result = new List<string>()  { "<BusinessRulesSpecifications>"};
            foreach (KeyValuePair<int, List<String>> Specification in SpecificationsDictionary)
            {
                result.Add("<"+ Specification.Value[0] + ">" + Specification.Value[1] + "</" + Specification.Value[0] + ">");
            }
            result.Add("</BusinessRulesSpecifications>");
            return result;
        }

    }
    public class  ConceptScaffoldModel
    {
        public int ID { get; set; }
        public String Name { get; set; }
        public String AggregateName { get; set; }  
        public SpecificationFactoryScaffoldModel AlternativeSpecificationFactory { get; set; }
        public List<SpecificationScaffoldModel> SingleSpecificationList { get; set; } = new List<SpecificationScaffoldModel>();  
        public List<ConceptScaffoldModel> HasOneAggregation { get; set; } = new List<ConceptScaffoldModel>();
        public List<ConceptScaffoldModel> HasManyAggregation { get; set; } = new List<ConceptScaffoldModel>();

        public ConceptScaffoldModel(int ConceptID, String ConceptName)
        {
            ID = ConceptID;
            Name = TextFormatter.SetCamelCaseOn(ConceptName);
            AggregateName = Name + "Aggregate";
        }

        public IList<string> AsTextLines(bool AsAggregate = false)
        {
            var result = new List<string>()
                {
                    "using System.Collections.Generic;",
                    "using MyNameSpace.Business.Interfaces;",
                    "using MyNameSpace.Business.Domain.Entities;",
                    "using MyNameSpace.Business.Domain.Specifications;",
                    "",
                    "namespace MyNameSpace.Business.Domain." + (AsAggregate? "Aggregates" : "Entities" ),
                    "{",
                    "",
                };
            result.Add("");
            result.Add("/// <summary>");
            result.Add("/// class " + (AsAggregate ? AggregateName : Name));
            result.Add("/// Responsability : " + (AsAggregate ? "Top level cluster of entities with " + Name.ToString() + " (@" + ID.ToString() + ") as root, governing consistent transaction and distribution synchronously"
                : "Reference object with persistent identity"));
            result.Add("/// </summary>");
            result.Add("public class  " + (AsAggregate ? AggregateName : Name));
            result.Add("{");
            foreach (var spec in HasOneAggregation)
            {
                result.Add("private " + spec.Name + " _" + spec.Name + ";");
            }
            foreach (var spec in HasManyAggregation)
            {
                result.Add("private List<" + spec.Name + ">  _" + spec.Name + ";");
            }
            result.Add(" ");
            if (!AsAggregate)
            {
                foreach (SpecificationScaffoldModel scaffold in SingleSpecificationList)
                {
                    result.Add("public " + scaffold.Name + " Get" + scaffold.Name + "(){ return new " + scaffold.Name + "();}");
                    result.Add(" ");
                }
                if (AlternativeSpecificationFactory != null)
                {
                    result.Add("I" + AlternativeSpecificationFactory.Name + " _" + AlternativeSpecificationFactory.Name + ";//To initialize");
                    foreach (KeyValuePair<int, List<SpecificationScaffoldModel>> Specification in AlternativeSpecificationFactory.SpecificationsDictionary)
                    {
                        result.Add("public " + Specification.Value[0].Interface + " Get" + Specification.Value[0].Name + "()");
                        result.Add("{");
                        result.Add("return _" + AlternativeSpecificationFactory.Name + ".Get" + Specification.Value[0].Name + "();");
                        result.Add("}");
                        result.Add(" ");
                    }
                }
            }
            result.Add("}");
            result.Add("");
            result.Add("}");
            return result;
        }
        public IList<string> AsRepositoryInterfaceTextLines()
        {
            var result = new List<string>()
                {
                    "using MyNameSpace.Business.Domain.Entities;",
                    "using MyNameSpace.Business.Domain.Aggregates;",
                    "",
                    "namespace MyNameSpace.Business.Interfaces",
                    "{",
                    "",
                    "/// <summary>",
                    "/// Repository Interface I"+ Name ,
                    "/// Responsability: Storage collection for "+ Name + "Aggregate (@" + ID.ToString() +") and its entities(decoupling collection from queriying contraints)",
                    "/// </summary>",
                    "public interface I"+ Name + "Repository",
                    "{",
                    Name + " Get(int id); "
                };
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }
    }

    public class  ServiceScaffoldModel
    {
        public int ID { get; set; }
        public String Name { get; set; }
        public ConceptScaffoldModel AggregateRoot { get; set; }

        public ServiceScaffoldModel(int ConceptID, String ServiceName, ConceptScaffoldModel Root)
        {
            ID = ConceptID;
            if (!ServiceName.Contains("Service")) ServiceName += "Service";
            Name = TextFormatter.SetCamelCaseOn(ServiceName);
            AggregateRoot = Root;
        }

        public IList<string> AsTextLines()
        {
            var result = new List<string>()
                {
                    "using MyNameSpace.Business.Domain.Entities;",
                    "using MyNameSpace.Business.Domain.Aggregates;",
                    "using MyNameSpace.Business.Infrastructure;",
                    "using MyNameSpace.Business.Interfaces;",
                    "",
                    "namespace MyNameSpace.Business.Services",
                    "{",
                    "",
                    "/// <summary>",
                    "/// Service class "+ Name ,
                    "/// Responsability: "+ (AggregateRoot == null? "Invoke application logic in charge of " + Name.Replace("Service","") : "Access, manipulate data and invoke business logic depending of " + Name +"Aggregate (@" + ID.ToString() + ")"),
                    "/// </summary>",
                    "public class "+ Name+ " : I"+ Name,
                    "{",
                    "",
                    (AggregateRoot == null? "" : "private I"+ AggregateRoot.Name + "Repository _"+ AggregateRoot.Name + "Repository;"),
                    "",
                    (AggregateRoot == null? "" : "public "+ Name + "(I"+ AggregateRoot.Name + "Repository "+ AggregateRoot.Name + "Repository)"),
                    (AggregateRoot == null? "" : "{"),
                    "",
                    (AggregateRoot == null? "" : "this._"+ AggregateRoot.Name + "Repository = "+ AggregateRoot.Name + "Repository;"),
                    (AggregateRoot == null? "" : "}"),
                    "",
                };
            result.Add("}"); result.Add(""); result.Add("}");
            return result;            
    }

        public IList<string> AsInterfaceTextLines()
        {
            var result = new List<string>()
                {
                    "using MyNameSpace.Business.Infrastructure;",
                    "",
                    "namespace MyNameSpace.Business.Interfaces",
                    "{",
                    "",
                    "/// <summary>",
                    "/// Service interface I"+ Name ,
                    "/// </summary>",
                    "public interface I"+ Name,
                    "{",
                };
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }
    }

    public class  SpecificationFactoryScaffoldModel
    {
        public Dictionary<int, List<SpecificationScaffoldModel>> SpecificationsDictionary { get; set; } = new Dictionary<int, List<SpecificationScaffoldModel>>();
        public int ID { get; set; }
        public String ConceptName { get; set; }
        public String Name { get; set; }

        public SpecificationFactoryScaffoldModel(int ConceptID, String FactoryConceptName)
        {
            ID = ConceptID;
            ConceptName = FactoryConceptName;
            Name = ConceptName + "SpecificationFactory";
        }
        public void AddDefaultSpecification(int DefaultSpecificationID, SpecificationScaffoldModel DefaultSpecification)
        {
            SpecificationsDictionary.Add(DefaultSpecificationID, new List<SpecificationScaffoldModel>());
            SpecificationsDictionary[DefaultSpecificationID].Add(DefaultSpecification);
        }
        public void AddAlternativeSpecification(int DefaultSpecificationID, SpecificationScaffoldModel AlternativeSpecification)
        {
            SpecificationsDictionary[DefaultSpecificationID].Add(AlternativeSpecification);
        }

        public IList<string> AsTextLines()
        {
            var result =  new List<string>()
                {
                    "using MyNameSpace.Business.Interfaces;",
                    "using MyNameSpace.Business.Domain.Specifications;",
                    "",
                    "namespace MyNameSpace.Business.Domain.Factories",
                    "{",
                    "",
                    "/// <summary>",
                    "/// class ",
                    "/// Responsability: provide an invariant interface that encapsulate business rules specification assigned to " + ConceptName,
                    "/// </summary>",
                    "public class  " + Name + " : I"+ Name,
                    "{",
                    ""
                };
            foreach (KeyValuePair<int, List<SpecificationScaffoldModel>> Specification in SpecificationsDictionary)
            {

                result.Add("private string _" + Specification.Value[0].Name + "ConfigKey;//To initialize");
                result.Add("public " + Specification.Value[0].Interface + " Get" + Specification.Value[0].Name +  "()");
                result.Add("{");
                result.Add("switch (_" + Specification.Value[0].Name + "ConfigKey)");
                result.Add("{");
                foreach (SpecificationScaffoldModel scaffold in Specification.Value)
                {
                    if (scaffold.Name != Specification.Value[0].Name)
                    {
                        result.Add("case \"" + scaffold.Name + "\":");
                        result.Add("return new " + scaffold.Name + "();");
                    }
                }
                result.Add("default:");
                result.Add("return new " + Specification.Value[0].Name + "();");
                result.Add("}");
                result.Add("");
                result.Add("}");
            }
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }


        public IList<string> AsInterfaceTextLines()
        {
            var result = new List<string>()
            {
                "using MyNameSpace.Business.Infrastructure;",
                "",
                "namespace MyNameSpace.Business.Interfaces",
                "{",
                "",
                "/// <summary>",
                "/// Factory interface I"+ Name ,
                "/// </summary>",
                "public interface I"+ Name,
                "{",
            };
            foreach (KeyValuePair<int, List<SpecificationScaffoldModel>> Specification in SpecificationsDictionary)
            {
                result.Add("" + Specification.Value[0].Interface + " Get" + Specification.Value[0].Name + "();");
            }
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }
    }

    public class SpecificationScaffoldModel
    {
        public String RawName { get; set; }
        public String Interface { get; set; }
        public String Name { get; set; }
        public int ID { get; set; }
        public String Content { get; set; }

        public SpecificationScaffoldModel(int SpecificationID, String SpecificationName, String SpecificationContent, String InterfaceName)
        {
            ID = SpecificationID;
            RawName = SpecificationName;
            Name = TextFormatter.SetCamelCaseOn(SpecificationName.ToLower()) + "Specification";
            Content = SpecificationContent;
            Interface = InterfaceName;
        }

        public IList<string> AsTextLines()
        {
            var result = new List<string>()
                {
                    "using MyNameSpace.Business.Interfaces;",
                    "",
                    "namespace MyNameSpace.Business.Domain.Specifications",
                    "{",
                    "",
                    "/// <summary>",
                    "/// class " + Name,
                    "/// Responsability: Encapsulates business rule #"+ ID.ToString() +" about <" + RawName + "> as boolean expression",
                    "/// </summary>",
                    "public class  " + Name + (Interface == null? "" : " : "+ Interface),
                    "{",
                    "",
                    "public bool IsSatisfiedBy()",
                    "{",
                    "return false;// "+ Content,
                    "}",
                    "",
                    ""
                };
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }
        public IList<string> AsInterfaceTextLines()
        {
            var result = new List<string>()
            {
                "using MyNameSpace.Business.Infrastructure;",
                "",
                "namespace MyNameSpace.Business.Interfaces",
                "{",
                "",
                "/// <summary>",
                "/// Service Interface "+ Interface ,
                "/// </summary>",
                "public interface "+ Interface,
                "{",
                "bool IsSatisfiedBy();//Satisfaction Parameters are missing",
            };
            result.Add("}"); result.Add(""); result.Add("}");
            return result;
        }

    }


}

