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
    public enum AssociationEnumType { unknown = 0, HasOne = 1, HasMany = 2 };
    public enum EventEnumType { unknown = 0, Create = 1, Update = 2, Delete = 3};
    public enum RequirementEnumType { unknown = 0, Default = 1, LogicAlternative = 2, UIAlternative = 3, Scenario = 4, Screen = 5, Field = 6 };
    public enum ContextEnumType { unknown = 0, DomainContext = 1, BusinessProcess = 2, Feature = 3, VariationPoint = 4 };
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

        public List<ItemViewModel> GetAllUseCaseViewModelsFor(int ProjectId)
        {
            List<ItemViewModel> result = new List<ItemViewModel>();
            foreach (RessourceDefinition ress in projectRepository.GetAllUseCaseDefinitionsFor(ProjectId).ToList())
            {
                result.Add(new ItemViewModel() { KeyValue = ress.Id.ToString(), Label = ress.Name.ToString() });
            }
            return result;
        }

        public List<ItemViewModel> GetAllRequirementViewModelsFor(int ProjectId)
        {
            List<ItemViewModel> result = new List<ItemViewModel>();
            foreach (RessourceRequirement requ in projectRepository.GetAllRequirementsFor(ProjectId).ToList())
            {
                result.Add(new ItemViewModel() { KeyValue = requ.Id.ToString(), Label = requ.Behavior.ToString() });
            }
            return result;
        }
        public List<RessourceAssociationViewModel> GetAllAssociationViewModelsFor(int ProjectId)
        {
            return mappingService.BuildRessourceAssociationViewModelFor(projectRepository.GetAllAssociationsFor(ProjectId));
        }

        public List<VersionViewModel> GetAllVersionViewModelsFor(int ProjectId)
        {
            List<VersionViewModel> result = new List<VersionViewModel>();
            foreach (ProjectVersion version in projectRepository.GetAllVersionFor(ProjectId).ToList())
            {
                result.Add(mappingService.BuildVersionViewModelFor(version));
            }
            return result;
        }

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

        public string[] MonthNames = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
        public string[] ProgressNames = new string[] { "Planned", "In Progress", "Completed", "Released" };
        public List<ProductViewModel> GetProductViewModelsFor(int ProjectId)
        {
            List<ProductViewModel> result = new List<ProductViewModel>();
            foreach (ProjectProduct rsc in projectRepository.GetAllProductsFor(ProjectId).OrderByDescending(x => x.Versions.Count()).ToList())
            {
                var PVM = new ProductViewModel() { ProductID = rsc.Id, Name = rsc.Name, Versions = mappingService.BuildVersionViewModelFor(rsc.Versions.OrderByDescending(x => x.ReleasedYear).ThenByDescending(x => x.ReleasedMonth).ToList()) };
                foreach (VersionViewModel version in PVM.Versions){
                    version.MonthName = MonthNames[version.ReleasedMonth -1];
                    version.ProgressName = ProgressNames[version.VersionEnumType - 1 ];
                    version.IsInProgress = version.VersionEnumType == (short)VersionEnumType.InProgress;
                    version.CompletedAlternativeCount = 1;
                    version.AlternativeCount = 12;
                }
                result.Add(PVM);
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
            editorVM.Infrastructures = mappingService.BuildItemViewModelFor(projectRepository.GetAllInfrastructuresFor(ProjectId).ToList());
            return editorVM;
        }
        public VersionEditorViewModel GetVersionEditorViewModelFor(int VersionId)
        {
            ProjectVersion version = projectRepository.GetVersion(VersionId);
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(version.Product.Project.Id).Where(x =>x.Id == version.Product.Id).ToList();
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(version.Product.Project.Id).ToList();
            var editorVM = new VersionEditorViewModel();
            editorVM.ProjectID = version.Product.Project.Id;
            editorVM.Definition = mappingService.BuildVersionViewModelFor(version);//VersionViewModel
            editorVM.ProductRequirements = mappingService.BuildRequirementViewModelFor(projectRepository.GetAllRequirementsFor(editorVM.ProjectID).ToList(), ProjectProducts , VariationPoints);
            editorVM.ProjectProducts = mappingService.BuildItemViewModelFor(projectRepository.GetAllProductsFor(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public RequirementViewModel GetRequirementViewModelFor(int requirementID)
        {
            RessourceRequirement requirement = projectRepository.GetRequirement(requirementID);
            return mappingService.BuildRequirementViewModelFor(requirement); 
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
            List<RessourceAssociation> childrenAggregations = ressourceRepository.GetAllChildrenAggregations(ConceptId).ToList();
            List<RessourceAssociation> parentAggregations = ressourceRepository.GetAllParentAggregations(ConceptId).ToList();
            DomainConceptFacade concept = new DomainConceptFacade(ressourceRepository.Get(ConceptId), childrenAggregations, parentAggregations, ressourceRepository.GetAllBehaviorRequirementsBy(ConceptId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(concept.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(concept.Definition.Project.Id);
            var editorVM = new DomainConceptEditorViewModel();
            editorVM.ProjectID = concept.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(concept.Definition);
            editorVM.HasOne = mappingService.BuildRessourceAssociationViewModelFor(concept.GetChildrenAggregatedAs(AssociationEnumType.HasOne));
            editorVM.HasMany = mappingService.BuildRessourceAssociationViewModelFor(concept.GetChildrenAggregatedAs(AssociationEnumType.HasMany));
            editorVM.PartOf = mappingService.BuildRessourceAssociationViewModelFor(concept.GetParentAggregatedAs(AssociationEnumType.HasOne));
            editorVM.PartsOf = mappingService.BuildRessourceAssociationViewModelFor(concept.GetParentAggregatedAs(AssociationEnumType.HasMany));
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(concept.Requirements, ProjectProducts, null);
            editorVM.Alternatives = mappingService.BuildRequirementViewModelFor(concept.Alternatives, ProjectProducts, VariationPoints);
            editorVM.ProjectConcepts = mappingService.BuildItemViewModelFor(projectRepository.GetAllConceptDefinitionsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectDomainContexts = mappingService.BuildItemViewModelFor(projectRepository.GetAllDomainContexts(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public UseCaseEditorViewModel GetUseCaseEditorViewModelFor(int FunctionId)
        {
            UseCaseFacade uc = new UseCaseFacade( ressourceRepository.Get(FunctionId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(uc.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(uc.Definition.Project.Id);
            var editorVM = new UseCaseEditorViewModel();
            editorVM.ProjectID = uc.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(uc.Definition);
            editorVM.Scenarios = mappingService.BuildRequirementViewModelFor(uc.Scenarios, null, null);
            editorVM.UISteps = mappingService.BuildRessourceAssociationViewModelFor(uc.UISteps);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(uc.Requirements, ProjectProducts, null);
            editorVM.RequirementOptions = mappingService.BuildItemViewModelFor(uc.Requirements);
            editorVM.Alternatives = mappingService.BuildRequirementViewModelFor(uc.Alternatives, ProjectProducts, VariationPoints);
            editorVM.VariationPoints = mappingService.BuildProjectContextTypeViewModelFor(VariationPoints);
            editorVM.ProjectBusinessProcesses = mappingService.BuildItemViewModelFor(projectRepository.GetAllBusinessProcessesFor(editorVM.ProjectID).ToList());
            editorVM.ProjectConcepts = mappingService.BuildItemViewModelFor(projectRepository.GetAllConceptDefinitionsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectUIs = mappingService.BuildItemViewModelFor(projectRepository.GetAllUIDefinitionsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectInfrastructures = mappingService.BuildItemViewModelFor(projectRepository.GetAllInfrastructuresFor(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public UIComponentEditorViewModel GetUIComponentEditorViewModelFor(int UIComponentId)
        {
            UIComponentFacade component = new UIComponentFacade(ressourceRepository.Get(UIComponentId), ressourceRepository.GetAllBehaviorRequirementsFrom(UIComponentId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(component.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(component.Definition.Project.Id);
            var editorVM = new UIComponentEditorViewModel();
            editorVM.ProjectID = component.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(component.Definition);
            editorVM.Screens = mappingService.BuildRequirementViewModelFor(component.Screens, null, null);
            editorVM.Fields = mappingService.BuildRequirementViewModelFor(component.Fields, null, null);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(component.Requirements, ProjectProducts, null);
            editorVM.Alternatives = mappingService.BuildRequirementViewModelFor(component.Alternatives, ProjectProducts, VariationPoints);
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
            viewModel.ProjectID = prj.Definition.Id;
        }

        public void CreateEditRessouceDefinitionWith(ref RessourceDefinitionViewModel viewModel, int UserId, int ProjectID)
        {
            RessourceDefinition RessourceDefinition = mappingService.ReBuildRessourceDefinitionWithViewModel(viewModel);
            Ressource rsc = new Ressource(RessourceDefinition);
            rsc.Definition.Project = projectRepository.Get(ProjectID).Definition;
            if(viewModel.ProjectContextId > 0) rsc.Definition.Context = projectRepository.GetContext(viewModel.ProjectContextId);
            rsc.ChangedBy(UserId);
            if (RessourceDefinition.Id > 0)
            {
                ressourceRepository.Update(rsc.Definition);
            } else
            {
                rsc.StartedBy(UserId);
                ressourceRepository.Add(rsc);
            }
            unitOfWork.Commit();
            viewModel.RessourceID = rsc.Definition.Id;
        }
        public void CreateEditRessouceAssociationWith(ref RessourceAssociationViewModel viewModel, int UserId, int ProjectID)
        {
            RessourceAssociation assoc = mappingService.ReBuildRessourceAssociationWithViewModel(viewModel);
            assoc.Parent = ressourceRepository.GetDefinition(viewModel.ParentID);
            assoc.Ressource = ressourceRepository.GetDefinition(viewModel.RessourceID);
            Change(assoc, UserId);
            if (assoc.Id > 0)
            {
                ressourceRepository.Update(assoc);
            } else
            {
                ressourceRepository.Add(assoc);
            }
            unitOfWork.Commit();
            viewModel.AssociationId = assoc.Id;
        }

        public void CreateEditRessourceRequirementWith(ref RequirementViewModel viewModel, int UserId, int ProjectID)
        {
            RessourceRequirement requirement = mappingService.ReBuildRessourceRequirementWithViewModel(viewModel);
            Change(requirement, UserId, true);
            if (requirement.IsAlternative)
            {
                RessourceRequirement defaultRequirement = ressourceRepository.GetRequirement(viewModel.DefaultBehaviorID);
                requirement.UseCase = defaultRequirement.UseCase;
                requirement.Concept = defaultRequirement.Concept;
                requirement.UI = defaultRequirement.UI;
                requirement.Infrastructure = defaultRequirement.Infrastructure;
                var variantIds = viewModel.ScopeIDs;
                requirement.Variants = projectRepository.GetAllVariantsFor(ProjectID).Where(x => variantIds.Contains(x.Id)).ToList();
            }
            else if (requirement.RequirementEnumType ==  (short)RequirementEnumType.Default)
            {
                if (viewModel.UseCaseID > 0) requirement.UseCase = ressourceRepository.GetDefinition(viewModel.UseCaseID);
                if (viewModel.ConceptID > 0) requirement.Concept = ressourceRepository.GetDefinition(viewModel.ConceptID);
                if (viewModel.UIID > 0) requirement.UI = ressourceRepository.GetDefinition(viewModel.UIID);
                if (viewModel.InfrastructureID > 0) requirement.Infrastructure = ressourceRepository.GetDefinition(viewModel.InfrastructureID);
                //TODO Modify each variants ?
            }
            if (requirement.Id > 0)
            {
                ressourceRepository.Update(requirement);
            }
            else
            {
                requirement.Project = projectRepository.GetDefinition(ProjectID);
                ressourceRepository.Add(requirement);
            }
            unitOfWork.Commit();
            viewModel.RequirementID = requirement.Id;
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
            viewModel.ContextTypeID = contextType.Id;
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
            viewModel.ContextID = context.Id;
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
            viewModel.KeyValue = product.Id.ToString();
        }

        public void CreateEditProjectVersionsWith(ref VersionViewModel viewModel, int UserId, int ProjectID)
        {
            ProjectVersion version = mappingService.ReBuildProjectVersionWithViewModel(viewModel);
            //version.Project = projectRepository.GetDefinition(ProjectID);
            version.Product = projectRepository.GetProduct(viewModel.ProductID);
            Change(version, UserId, true);
            if (version.Id > 0)
            {
                projectRepository.Update(version);
            }
            else
            {
                projectRepository.Add(version);
            }
            unitOfWork.Commit();
            viewModel.VersionID = version.Id;
        }
        public void CreateEditVersionRequirementWith(ref ItemViewModel viewModel, int UserId, int ProjectID)
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

        public List<SearchResultViewModel> GetSearchResultViewModelsFor(int ProjectId, string Query)
        {
            var result = new List<SearchResultViewModel>();
            if (Query.Length > 0)
            {
            IQueryable<RessourceDefinition> ressMatches = ressourceRepository.SearchAllRessourcesWith(ProjectId, Query);
            IQueryable<RessourceRequirement> requMatches = ressourceRepository.SearchAllRequirementsWith(ProjectId, Query);
            foreach (RessourceDefinition ress in ressMatches.OrderBy(x => x.ScaleOrder).ThenBy(x => x.StepOrder))
            {
                var VM = new SearchResultViewModel();
                VM.RessourceId = ress.Id;
                VM.RessourceName = ress.Name;
                VM.HasSearchResultInDefinition = true;
                if  (ress.Definition != null) VM.DefinitionExtract += ress.Definition.Substring(0, (ress.Definition.Length < 100) ? ress.Definition.Length : 100);
                result.Add(VM);
            }
            foreach (RessourceRequirement requ in requMatches)
            {
                SearchResultViewModel VM;
                if (result.Where(x => x.HasSearchResultInRequirement == false && x.RessourceId == requ.UseCase.Id).Count() > 0)
                {
                    VM = result.Where(x => x.HasSearchResultInRequirement == false && x.RessourceId == requ.UseCase.Id).FirstOrDefault();
                    VM.RequirementId = requ.Id;
                    VM.HasSearchResultInRequirement = true;
                    if (requ.Description != null) VM.RequirementExtract = requ.Description.Substring(0, (requ.Description.Length < 100) ? requ.Description.Length : 100);
                }
                else
                {
                    VM = new SearchResultViewModel();
                    VM.RessourceId = requ.UseCase.Id;
                    VM.RessourceName  = requ.UseCase.Name;
                    VM.RequirementId = requ.Id;
                    VM.HasSearchResultInRequirement = true;
                    VM.RequirementExtract = requ.Behavior;
                    if (requ.Description != null) VM.RequirementExtract += " : " + requ.Description.Substring(0, (requ.Description.Length < 100) ? requ.Description.Length : 100);
                    result.Add(VM);
                }
                }
            }
            return result;
    }
    }
    
}