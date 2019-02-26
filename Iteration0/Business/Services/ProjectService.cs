using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain;
using Iteration0.Data.Repositories;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.ViewModels;

namespace Iteration0.Business.Services
{
    //TODO? Enum should become valueObject https://ardalis.com/enum-alternatives-in-c
    public enum RessourceEnumType {unknown = 0, Domain = 1, UseCase = 2, Component = 3, Infrastructure = 4 };
    public enum AssociationEnumType { unknown = 0, HasAttribute = 1, HasOne = 2, HasMany = 3, AggregatesWith = 4, OperatesOn = 5, HasActor = 6, UseInfrastructure = 7, UISteps = 8 };
    public enum EventEnumType { unknown = 0, Create = 1, Update = 2, Delete = 3};
    public enum RequirementEnumType { unknown = 0, Rule = 1, Scenario = 2, Field = 3, Screen = 3 };
    public enum ContextEnumType { unknown = 0, DomainContext = 1, BusinessProcess = 2, Feature = 3, RequirementVariation = 4 };
    public enum VersionEnumType { unknown = 0, Planned = 1, InProgress = 2, Completed = 3, Released = 4 };
    //public enum CodeGeneratorEnumSubType { unknown = 0, ValueObject = 2, Entity = 3, Aggregate = 4, Function = 5, System = 6, Service = 7, Feature = 8, Component = 9, Actor = 10 };

    public class ProjectService : IProjectService
    {
        private IProjectRepository projectRepository;
        private IRessourceRepository ressourceRepository;
        private IMappingService mappingService;
        private IUnitOfWork unitOfWork;

        public void ConfigureDependencies(IProjectRepository SvcProjectRepository, IRessourceRepository svcRessourceRepository, IMappingService SvcMapperService)
        {
            unitOfWork = new UnitOfWork(DatabaseContextFactory.Instance); ;
            projectRepository = SvcProjectRepository; ressourceRepository = svcRessourceRepository;
            projectRepository.ConfigureDependencies(unitOfWork); ressourceRepository.ConfigureDependencies(unitOfWork);
            mappingService = SvcMapperService;
        }
        public List<ProjectSummaryViewModel> SummarizeAllProjects()
        {
            List <ProjectSummaryViewModel> result = new List<ProjectSummaryViewModel>();
            foreach(Project prj in projectRepository.GetAll().ToList())
            {
                result.Add(new ProjectSummaryViewModel() { ProjectId = prj.Definition.Id, Title = prj.Definition.Title, ConceptCount = prj.Concepts.Where(c => c.IsEnabled == true).Count(), ComponentCount = prj.UIComponents.Where(c => c.IsEnabled == true).Count(), FunctionCount = prj.UseCases.Where(c => c.IsEnabled == true).Count() });
            }
            return result;
        }
        public List<ItemViewModel> GetAllProjectAsItemViewModel()
        {
            List<ItemViewModel> result = new List<ItemViewModel>();
            foreach (Project prj in projectRepository.GetAll().ToList())
            {
                result.Add(new ItemViewModel() { KeyValue = prj.Definition.Id.ToString(), Label = prj.Definition.Title.ToString() });
            }
            return result;
        }
        //public List<ConceptSummaryViewModel> SummarizeAllConceptsFor( int ProjectId)
        //{
        //    List<ConceptSummaryViewModel> result = new List<ConceptSummaryViewModel>();
        //    foreach (DomainConceptFacade rsc in projectRepository.GetAllDomainConcepts(ProjectId).OrderBy(x => x.Definition.SortOrder).ThenBy(y => y.Definition.Name).ToList())
        //    {
        //        result.Add(new ConceptSummaryViewModel() { Id = rsc.Definition.Id, Name = "[" + rsc.Definition.Context.Name + "] " + rsc.Definition.Name });
        //    }
        //    return result;
        //}
        //public List<FunctionSummaryViewModel> SummarizeAllUseCasesFor(int ProjectId)
        //{
        //    List<FunctionSummaryViewModel> result = new List<FunctionSummaryViewModel>();
        //    foreach (UseCaseFacade rsc in projectRepository.GetAllUseCases(ProjectId).OrderBy(x => x.Definition.SortOrder).ThenBy(y => y.Definition.Name).ToList())
        //    {
        //        result.Add(new FunctionSummaryViewModel() { Id = rsc.Definition.Id, Name = "[" + rsc.Definition.Context.Name + "] " + rsc.Definition.Name });
        //    }
        //    return result;
        //}
        //public List<ComponentSummaryViewModel> SummarizeAllUIComponentFor(int ProjectId)
        //{
        //    List<ComponentSummaryViewModel> result = new List<ComponentSummaryViewModel>();
        //    foreach (UIComponentFacade rsc in projectRepository.GetAllUIComponents(ProjectId).OrderBy(x => x.Definition.SortOrder).ThenBy(y => y.Definition.Name).ToList())
        //    {
        //        result.Add(new ComponentSummaryViewModel() { Id = rsc.Definition.Id, Name = "["+rsc.Definition.Context.Name + "] " + rsc.Definition.Name });
        //    }
        //    return result;
        //}
        public BoardEditorViewModel GetDomainConceptsBoardEditorViewModelFor(int ProjectId)
        {
            List<RessourceDefinition> Ressources = projectRepository.GetAllConceptDefinitionsFor(ProjectId).ToList();
            Project project = projectRepository.Get(ProjectId);
            var editorVM = new BoardEditorViewModel();
            editorVM.ItemType = RessourceEnumType.Domain;
            editorVM.ProjectID = ProjectId;
            editorVM.ProjectPools = mappingService.BuildItemViewModelFor(projectRepository.GetAllDomainContexts(ProjectId).OrderBy(x => x.SortOrder).ToList());
            editorVM.Pools = mappingService.BuildBoardPoolViewModelFor(editorVM.ProjectPools, Ressources);
            return editorVM;
        }

        public BoardEditorViewModel GetUseCasesBoardEditorViewModelFor(int ProjectId)
        {
            List<RessourceDefinition> Ressources = projectRepository.GetAllUseCaseDefinitionsFor(ProjectId).ToList();
            Project project = projectRepository.Get(ProjectId);
            var editorVM = new BoardEditorViewModel();
            editorVM.ItemType = RessourceEnumType.UseCase;
            editorVM.ProjectID = ProjectId;
            editorVM.ProjectPools = mappingService.BuildItemViewModelFor(projectRepository.GetAllBusinessProcessesFor(ProjectId).OrderBy(x => x.SortOrder).ToList());
            editorVM.Pools = mappingService.BuildBoardPoolViewModelFor(editorVM.ProjectPools, Ressources);
            return editorVM;
        }

        public BoardEditorViewModel GetUIComponentsBoardEditorViewModelFor(int ProjectId)
        {
            List<RessourceDefinition> Ressources = projectRepository.GetAllUIDefinitionsFor(ProjectId).ToList();
            Project project = projectRepository.Get(ProjectId);
            var editorVM = new BoardEditorViewModel();
            editorVM.ItemType = RessourceEnumType.Component;
            editorVM.ProjectID = ProjectId;
            editorVM.ProjectPools = mappingService.BuildItemViewModelFor(projectRepository.GetAllFeaturesFor(ProjectId).OrderBy(x => x.SortOrder).ToList());
            editorVM.Pools = mappingService.BuildBoardPoolViewModelFor(editorVM.ProjectPools, Ressources);
            return editorVM;
        }
        public List<ProductViewModel> GetProductViewModelFor(int ProjectId)
        {
            List<ProductViewModel> result = new List<ProductViewModel>();
            foreach (ProjectProduct rsc in projectRepository.GetAllProductsFor(ProjectId).OrderBy(x => x.Name).ToList())
            {
                result.Add(new ProductViewModel() { ProductID = rsc.Id, Name = rsc.Name, Versions = mappingService.BuildVersionViewModelFor(rsc.Versions.ToList()) });
            }
            return result;
        }
        //public List<ProjectHistoryViewModel> SummarizeProjectHistoryFor(int ProjectId)
        //{
        //    List<ProjectHistoryViewModel> result = new List<ProjectHistoryViewModel>();
        //    //foreach (Event evn in projectRepository.GetAllEventsByProjectId(ProjectId).ToList())
        //    //{
        //    //    result.Add(new ProjectHistoryViewModel() { Event = evn.Id.ToString()  + '-' + evn.ActionLog });
        //    //}
        //    return result;
        //}

        public ProjectEditorViewModel GetProjectEditorViewModelFor(int ProjectId)
        {
            Project project = projectRepository.Get(ProjectId);
            var editorVM = new ProjectEditorViewModel();
            editorVM.DomainContextId = project.ContextTypes.Where(x => x.ContextEnumType == (short)ContextEnumType.DomainContext).First().Id;
            editorVM.BusinessProcessesId = project.ContextTypes.Where(x => x.ContextEnumType == (short)ContextEnumType.BusinessProcess).First().Id;
            editorVM.FeaturesId = project.ContextTypes.Where(x => x.ContextEnumType == (short)ContextEnumType.Feature).First().Id;
            editorVM.Definition = mappingService.BuildProjectDefinitionFormViewModelFor(project.Definition);
            editorVM.DomainContexts = mappingService.BuildProjectContextViewModelFor(projectRepository.GetAllDomainContexts(ProjectId).ToList());
            editorVM.VariationPoints = mappingService.BuildProjectContextTypeViewModelFor(projectRepository.GetAllVariationPointsFor(ProjectId).ToList());
            editorVM.BusinessProcesses = mappingService.BuildProjectContextViewModelFor(projectRepository.GetAllBusinessProcessesFor(ProjectId).ToList());
            editorVM.Features = mappingService.BuildProjectContextViewModelFor(projectRepository.GetAllFeaturesFor(ProjectId).ToList());
            editorVM.Products = mappingService.BuildItemViewModelFor(projectRepository.GetAllProductsFor(ProjectId).ToList());
            return editorVM;
        }
        public VersionEditorViewModel GetVersionEditorViewModelFor(int VersionId)
        {
            ProjectVersion version = projectRepository.GetVersion(VersionId);
            var editorVM = new VersionEditorViewModel();
            editorVM.ProjectID = version.Product.Project.Id;
            editorVM.Definition = mappingService.BuildVersionViewModelFor(version);//VersionViewModel
            editorVM.ProductRequirements = mappingService.BuildRequirementViewModelFor(projectRepository.GetAllRequirementsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectProducts = mappingService.BuildItemViewModelFor(projectRepository.GetAllProductsFor(editorVM.ProjectID).ToList());
            return editorVM;
        }

        public RessourceDefinitionViewModel GetRessourceDefinitionFor(int RessourceId)
        {
            var def = ressourceRepository.GetDefinition(RessourceId);
            return mappingService.BuildRessourceDefinitionViewModelFor(def);
        }

        public dynamic GetRessourceEditorViewModelFor(int RessourceId)
        {
            var def = ressourceRepository.GetDefinition(RessourceId);
            switch (def.RessourceEnumType)
            {
                case (short)RessourceEnumType.Domain:
                    return GetDomainConceptEditorViewModelFor(RessourceId);
                case (short)RessourceEnumType.UseCase:
                    return GetUseCaseEditorViewModelFor(RessourceId);
                case (short)RessourceEnumType.Component:
                    return GetUIComponentEditorViewModelFor(RessourceId);
                default:
                    return null;
            }
        }
        public DomainConceptEditorViewModel GetDomainConceptEditorViewModelFor(int ConceptId)
        {
            DomainConceptFacade concept = new DomainConceptFacade(ressourceRepository.Get(ConceptId));
            //Project project = projectRepository.Get(concept.Definition.Project.Id);
            var editorVM = new DomainConceptEditorViewModel();
            editorVM.ProjectID = concept.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(concept.Definition);
            editorVM.Attributes = mappingService.BuildRessourceAssociationViewModelFor(concept.Attributes);
            editorVM.HasOneAssociations = mappingService.BuildRessourceAssociationViewModelFor(concept.HasOneAssociations);
            editorVM.HasManyAssociations = mappingService.BuildRessourceAssociationViewModelFor(concept.HasManyAssociations);
            editorVM.Operations = mappingService.BuildRessourceAssociationViewModelFor(concept.Operations);
            editorVM.ProjectConcepts = mappingService.BuildItemViewModelFor(projectRepository.GetAllConceptDefinitionsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectDomainContexts = mappingService.BuildItemViewModelFor(projectRepository.GetAllDomainContexts(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public UseCaseEditorViewModel GetUseCaseEditorViewModelFor(int FunctionId)
        {
            UseCaseFacade uc = new UseCaseFacade( ressourceRepository.Get(FunctionId));
            var editorVM = new UseCaseEditorViewModel();
            editorVM.ProjectID = uc.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(uc.Definition);
            editorVM.Scenarios = mappingService.BuildRequirementViewModelFor(uc.Scenarios);
            editorVM.UISteps = mappingService.BuildRessourceAssociationViewModelFor(uc.UISteps);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(uc.Requirements);
            editorVM.VariationPoints = mappingService.BuildProjectContextTypeViewModelFor(projectRepository.GetAllVariationPointsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectBusinessProcesses = mappingService.BuildItemViewModelFor(projectRepository.GetAllBusinessProcessesFor(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public UIComponentEditorViewModel GetUIComponentEditorViewModelFor(int UIComponentId)
        {
            UIComponentFacade component = new UIComponentFacade(ressourceRepository.Get(UIComponentId));
            var editorVM = new UIComponentEditorViewModel();
            editorVM.ProjectID = component.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(component.Definition);
            editorVM.Screens = mappingService.BuildRequirementViewModelFor(component.Screens);
            editorVM.Fields = mappingService.BuildRequirementViewModelFor(component.Fields);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(component.Requirements);
            editorVM.VariationPoints = mappingService.BuildProjectContextTypeViewModelFor(projectRepository.GetAllVariationPointsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectFeatures = mappingService.BuildItemViewModelFor(projectRepository.GetAllFeaturesFor(editorVM.ProjectID).ToList());
            return editorVM;
        }
        
        public void CreateEditProjectDefinitionWith(ref ProjectDefinitionFormViewModel viewModel, int UserId, int ProjectID)
        {
            Project prj;
            ProjectDefinition projectDefinition = mappingService.ReBuildProjectDefinitionWithViewModel(viewModel);
            if (projectDefinition.Id > 0)
            {
                prj = new Project(projectDefinition, null);
                prj.ChangedBy(UserId);
                projectRepository.Update(prj.Definition);
            } else
            {
                prj = new Project();
                prj.Definition = projectDefinition;
                prj.StartedBy(UserId);
                prj.Definition.ContextTypes = new HashSet<ProjectContextType>();
                prj.Definition.ContextTypes.Add( new ProjectContextType {Name = "DomainContext", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.DomainContext, UpdatedDate=DateTime.Now, UpdatedBy=UserId });
                prj.Definition.ContextTypes.Add(new ProjectContextType {Name = "BusinessProcess", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.BusinessProcess, UpdatedDate = DateTime.Now, UpdatedBy = UserId });
                prj.Definition.ContextTypes.Add(new ProjectContextType {Name = "Feature", ScaleOrder = 1, ContextEnumType = (short)ContextEnumType.Feature, UpdatedDate = DateTime.Now, UpdatedBy = UserId });
                projectRepository.Add(prj);
            }
            unitOfWork.DatabaseContext.SaveChanges();
            //.Commit();
            viewModel.ProjectID = prj.Definition.Id;
        }

        public void CreateEditRessouceDefinitionWith(ref RessourceDefinitionViewModel viewModel, int UserId, int ProjectID)
        {
            Ressource rsc;
            RessourceDefinition RessourceDefinition = mappingService.ReBuildRessourceDefinitionWithViewModel(viewModel);
            ProjectContext context = projectRepository.GetContext(viewModel.ProjectContextId);
            if (RessourceDefinition.Id > 0)
            {
                rsc = new Ressource(RessourceDefinition);
                rsc.ChangedBy(UserId);
                rsc.Definition.Context = context;
                ressourceRepository.Update(rsc.Definition);
            } else
            {
                Project project = projectRepository.Get(ProjectID);
                rsc = new Ressource();
                rsc.Definition = RessourceDefinition;
                rsc.StartedBy(UserId);
                rsc.Definition.Project = project.Definition;
                rsc.Definition.Context = context;
                ressourceRepository.Add(rsc);
            }
            unitOfWork.Commit();
            viewModel.RessourceID = rsc.Definition.Id;
        }
        public void CreateEditRessouceAssociationWith(ref RessourceAssociationViewModel viewModel, int UserId, int ProjectID)
        {
            RessourceAssociation assoc = mappingService.ReBuildRessourceAssociationWithViewModel(viewModel);
            if (assoc.Id > 0)
            {
                ressourceRepository.Update(assoc);
            } else
            {
                ressourceRepository.Add(assoc);
            }
            unitOfWork.Commit();
        }

        public void CreateEditRessourceRequirementWith(ref RequirementViewModel viewModel, int UserId, int ProjectID)
        {
            RessourceRequirement requirement = mappingService.ReBuildRessourceRequirementWithViewModel(viewModel);
            Change(requirement, UserId, true);
            requirement.Ressource = ressourceRepository.GetDefinition(viewModel.RessourceID);
            if (requirement.Id > 0)
            {
                ressourceRepository.Update(requirement);
            }
            else
            {
                ressourceRepository.Add(requirement);
            }
            unitOfWork.Commit();
        }

        public void CreateEditProjectContextTypesWith(ref ProjectContextTypeViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectContextType contextType = mappingService.ReBuildProjectContextTypeWithViewModel(viewModel);
            Change(contextType, UserId, true);
            contextType.Project = projectRepository.GetDefinition(ProjectID);
            if (contextType.Id > 0)
            {
                projectRepository.Update(contextType);
            }
            else
            {
                projectRepository.Add(contextType);
            }
            unitOfWork.Commit();
        }

        public void CreateEditProjectContextsWith(ref ProjectContextViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectContext context = mappingService.ReBuildProjectContextWithViewModel(viewModel);
            context.Type = projectRepository.GetContextType(viewModel.ContextTypeID);
            context.Project = projectRepository.GetDefinition(ProjectID);
            Change(context, UserId, true);
            if (context.Id > 0)
            {
                projectRepository.Update(context);
            }
            else
            {
                projectRepository.Add(context);
            }
            unitOfWork.Commit();
        }

        public void CreateEditProjectProductWith(ref ItemViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectProduct product = mappingService.ReBuildProjectProductWithViewModel(viewModel);
            product.Project = projectRepository.GetDefinition(ProjectID);
            Change(product, UserId, true);
            if (product.Id > 0)
            {
                projectRepository.Update(product);
            }
            else
            {
                projectRepository.Add(product);
            }
            unitOfWork.Commit();
        }

        public void CreateEditProjectVersionsWith(ref VersionViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectVersion version = mappingService.ReBuildProjectVersionWithViewModel(viewModel);
            Change(version, UserId, true);
            if (version.Id > 0)
            {
                projectRepository.Update(version);
            }
            else
            {
                projectRepository.Add(version);
            }
            //VersionRequirement, VersionRequirementViewModel ReBuildVersionRequirementWithViewModel
            unitOfWork.Commit();
        }
        public void CreateEditVersionRequirementWithWith(ref ItemViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectVersion version = projectRepository.GetVersion(Int32.Parse(viewModel.ParentKeyValue));
            RessourceRequirement requ = ressourceRepository.GetRequirement(Int32.Parse(viewModel.KeyValue));
            version.Requirements.Add(requ);
            unitOfWork.Commit();
        }

        public void RemoveProjectVersionWith(int versionID, int ProjectID, int UserId)
        {
            ProjectVersion version = projectRepository.GetVersion(versionID);
            Change(version, UserId, true);
            version.IsEnabled = false;
            projectRepository.Update(version);
        }
        public void RemoveProjectContextTypeWith(int contextTypeID, int ProjectID, int UserId)
        {
            ProjectContextType context = projectRepository.GetContextType(contextTypeID);
            Change(context, UserId, true);
            context.IsEnabled = false;
            projectRepository.Update(context);
            unitOfWork.Commit();
        }

        public void RemoveProjectContextWith(int contextID, int ProjectID, int UserId)
        {
            ProjectContext context = projectRepository.GetContext(contextID);
            Change(context, UserId, true);
            context.IsEnabled = false;
            projectRepository.Update(context);
            unitOfWork.Commit();
        }

        public void RemoveProductWith(int productID, int ProjectID, int UserId)
        {
            ProjectProduct product = projectRepository.GetProduct(productID);
            Change(product, UserId, true);
            product.IsEnabled = false;
            projectRepository.Update(product);
            unitOfWork.Commit();
        }

        public void RemoveRemoveRessourceDefinition(int ressourceID, int ProjectID, int UserId)
        {
            RessourceDefinition version = ressourceRepository.GetDefinition(ressourceID);
            Change(version, UserId, true);
            version.IsEnabled = false;
            ressourceRepository.Update(version);
            unitOfWork.Commit();
        }

        public void RemoveRessourceAssociationWith(int associationID, int ressourceID, int UserId)
        {
            RessourceAssociation ass = ressourceRepository.GetAssociation(associationID);
            RessourceDefinition ress = ressourceRepository.GetDefinition(ressourceID);
            ress.Associations.Remove(ass);
            unitOfWork.Commit();
        }
        
        public void RemoveRessourceRequirementWith(int requirementID, int ProjectID, int UserId)
        {
            RessourceRequirement requirement = ressourceRepository.GetRequirement(requirementID);
            Change(requirement, UserId, true);
            requirement.IsEnabled = false;
            ressourceRepository.Update(requirement);
            unitOfWork.Commit();
        }
        public void RemoveVersionRequirementWith(int requirementID, int VersionID, int UserId)
        {
            RessourceRequirement requirement = ressourceRepository.GetRequirement(requirementID);
            ProjectVersion version = projectRepository.GetVersion(VersionID);
            version.Requirements.Remove(requirement);
            unitOfWork.Commit();
        }
        
        private void Change(IEntity entity, int updatedByUserId, bool MustLog = true)
        {
            entity.UpdatedBy = updatedByUserId; entity.UpdatedDate = DateTime.Now;
            //log 
        }
        private void ChangeAll(List<IEntity> entities, int updatedByUserId)
        {
            foreach (IEntity entity in entities)
            {
                Change(entity, updatedByUserId, false);
            }
            //log 
        }


    }
    
}