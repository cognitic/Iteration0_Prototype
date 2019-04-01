using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain;
using Iteration0.Data.Repositories;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.ViewModels;
using System.Data.Entity;
using Iteration0.Business.Infrastructure;

namespace Iteration0.Business.Services
{
    //TODO? Enum should become valueObject https://ardalis.com/enum-alternatives-in-c
    public enum PDFEnumType { unknown = 0, UseCases = 1, UIs = 2, Glossary = 3 };
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
        public DocumentViewModel GetGlossaryDocumentViewModelFor(int projectID)
        {
            ProjectDefinition project = projectRepository.GetDefinition(projectID);
            List<DomainConceptFacade> Ressources = projectRepository.GetAllDomainConcepts(projectID).ToList();
            List<DocSectionViewModel> content = new List<DocSectionViewModel>();
            foreach (DomainConceptFacade uc in Ressources)
            {
                var header1 = uc.Definition.Context.Name;
                var header2 = "Aggregate Root";
                var header3 = uc.Definition.Name;
                var sectionContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                content.Add(new DocSectionViewModel(header1, header2, header3, sectionContent));
            }
            return new DocumentViewModel(project.Title, "Glossary", content.OrderBy(x => x.Header1).ThenBy(y => y.Header2).ToList(), TextFormatter.SetCamelCaseOn(project.Title) + "_Glossary_" + DateTime.Now.ToString("yyyy_MM_dd"));
        }
        public DocumentViewModel GetUseCasesDocumentViewModelFor(int projectID)
        {
            ProjectDefinition project = projectRepository.GetDefinition(projectID);
            List<UseCaseFacade> Ressources = projectRepository.GetAllUseCases(projectID).ToList();
            List<DocSectionViewModel> content = new List<DocSectionViewModel>();
            foreach (UseCaseFacade uc in Ressources)
            {
                var header1 = uc.Definition.Context.Name;
                var header2 = uc.Definition.Name;
                var header3 = "Requirements";
                var sectionContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                content.Add(new DocSectionViewModel(header1, header2, header3, sectionContent));
                header3 = "Alternatives";
                sectionContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                content.Add(new DocSectionViewModel(header1, header2, header3, sectionContent));
            }
            return new DocumentViewModel(project.Title, "Use Cases Specifications", content.OrderBy(x => x.Header1).ThenBy(y => y.Header2).ToList(), TextFormatter.SetCamelCaseOn(project.Title) + "_UsesCases_" + DateTime.Now.ToString("yyyy_MM_dd"));
        }
        public DocumentViewModel GetUIsDocumentViewModelFor(int projectID)
        {
            ProjectDefinition project = projectRepository.GetDefinition(projectID);
            List <UIComponentFacade> Ressources = projectRepository.GetAllUIComponents(projectID).ToList();
            List<DocSectionViewModel> content = new List<DocSectionViewModel>();
            foreach (UIComponentFacade ui in Ressources)
            {
                var header1 = ui.Definition.Context.Name;
                var header2 = ui.Definition.Name;
                var header3 = "";
                var sectionContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                content.Add(new DocSectionViewModel(header1, header2, header3, sectionContent));
                header3 = "Fields";
                sectionContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                content.Add(new DocSectionViewModel(header1, header2, header3, sectionContent));
            }
            return new DocumentViewModel(project.Title, "UI Specifications", content.OrderBy(x => x.Header1).ThenBy(y => y.Header2).ToList(), TextFormatter.SetCamelCaseOn(project.Title) + "_UI_" + DateTime.Now.ToString("yyyy_MM_dd"));
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
            foreach (RessourceRequirement requ in projectRepository.GetAllBehaviorRequirementsFor(ProjectId).ToList())
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

        //TODO Add this function to an Helper
        public int FindCombinaisonIndexInto(List<int[]> combinaisonList, int[] combinaisonSearch)
        {
            var result = -1; var index = 0;
            foreach (var combinaison in combinaisonList)
            {
                if (combinaison.SequenceEqual(combinaisonSearch)) { result = index; break; }
                index += 1;
            }
            return result;
        }
        public int FindCombinaisonLastKeyInto(Dictionary<int, List<int[]>> combinaisonDictionary, int[] combinaisonSearch)
        {
            var result = -1;
            foreach (var entry in combinaisonDictionary)
            {
                if (FindCombinaisonIndexInto(combinaisonDictionary[entry.Key], combinaisonSearch) != -1) result = entry.Key;//No Break == Latest
            }
            return result;
        }

        public List<int[]> BuildDeepCopyFrom(List<int[]> combinaisonList)
        {
            var result = new List<int[]>();
            if (combinaisonList.Count > 0)
            {
                var combinationLength = combinaisonList[0].Length;
                foreach (var combinaison in combinaisonList)
                {
                    var combinationCopy = new int[combinationLength];
                    for (var i = 0; i < combinationLength; i++)
                    {
                        combinationCopy[i]= combinaison[i];
                    }
                    result.Add(combinationCopy);
                }
            }
            return result;
        }
        
        public String GetScopeSummaryFor(int[] scope, List<ProjectContextType> variationPoints) 
        {
            var result = "";
            var pointIndex = 0;
            foreach (ProjectContextType pct in variationPoints)
            {
                foreach (ProjectContext pc in pct.Contexts)
                {
                    if (scope[pointIndex] == pc.Id) { result += pc.Name + ", "; }
                }
                pointIndex += 1;
            }
            if (result.Length > 0) result = result.Substring(0, result.Length - 2);
            return result;
        }

        public List<int[]> GetScopeCombinaisonListFor(List<RessourceRequirement> requirements, List<ProjectContextType> variationPoints)
        {
            var result = new List<int[]>();
            foreach (RessourceRequirement req in requirements)
            {
                var combination = new int[variationPoints.Count];
                var pointIndex = 0;
                foreach (ProjectContextType pct in variationPoints)
                {
                    foreach (ProjectContext vrt in req.Variants) if (vrt.Type.Id == pct.Id) { combination[pointIndex] = vrt.Id; }
                    pointIndex += 1;
                }
                if (FindCombinaisonIndexInto(result, combination) == -1) { result.Add(combination); }
            }
            return result;
        }
        public List<ProductAlternativeViewModel> GetProductAlternativeViewModelsFor(List<ProjectContextType> variationPoints, List<RessourceRequirement> requirements, List<ProjectProduct> ProjectProducts)
        {
            var result = new List<ProductAlternativeViewModel>();
            var alternativeCombinations = GetScopeCombinaisonListFor(requirements, variationPoints);
            foreach (var scope in alternativeCombinations)
            {
                var ProductAlternative = new ProductAlternativeViewModel();
                ProductAlternative.ScopeIDs = scope.ToList();
                ProductAlternative.ScopeSummary = GetScopeSummaryFor(scope, variationPoints);
                if (ProjectProducts.Count>0) ProductAlternative.AlternativeRequirements = mappingService.BuildRequirementViewModelFor(GetRequirementsWithinScope(requirements, variationPoints, scope), ProjectProducts, variationPoints);
                result.Add(ProductAlternative);
            }
            return result.OrderBy(alt => alt.ScopeSummary).ToList();
        }

        public List<RessourceRequirement> GetRequirementsWithinScope(List<RessourceRequirement> requirements, List<ProjectContextType> variationPoints, int[] scope)
        {
            var result = new List<RessourceRequirement>();
            foreach (RessourceRequirement req in requirements)
            {
                var IsWithinScope = true;
                var pointIndex = 0;
                foreach (ProjectContextType pct in variationPoints)
                {
                    var HasScopeVariant = false;
                    foreach (ProjectContext pc in pct.Contexts)
                    {
                        if (scope[pointIndex] == pc.Id){
                            foreach (ProjectContext variant in req.Variants)
                            {
                                if (variant.Id == pc.Id) { HasScopeVariant = true; break; }
                            }
                        }
                        if (HasScopeVariant) {break; }
                    }
                    if (!HasScopeVariant) { IsWithinScope = false; break; }
                    pointIndex += 1;
                }
                if (IsWithinScope) { result.Add(req); }
            }
            return result;
        }

        public string[] MonthNames = new string[] { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
        public string[] ProgressNames = new string[] { "Planned", "In Progress", "Completed", "Released" };
        public List<ProductViewModel> GetProductViewModelsFor(int ProjectId)
        {
            var allVariationPoints = projectRepository.GetAllVariationPointsFor(ProjectId).ToList();
            var allVersions = projectRepository.GetAllVersionFor(ProjectId);//.ToList();
            //Scope Combinaisons
            //TODO order version by year then month everywhere and use only UsedAsProductAlternative VariationPoint
            var versionMandatoryDictionnary = new Dictionary<int, List<int[]>>();
            foreach (ProjectVersion pv in allVersions)
            {
                var mandatoryRequirements = pv.Requirements.Where(r => r.Priority == 5).ToList();
                versionMandatoryDictionnary.Add(pv.Id, GetScopeCombinaisonListFor(mandatoryRequirements, allVariationPoints));                
            }
            var NonAssignedMandatoryRequirements = projectRepository.GetAllBehaviorRequirementsFor(ProjectId).Where(r => r.Versions.Count ==0 && r.Priority == 5).ToList();//Priority 5: Mandatory/Scope
            var projectNonAssignedCombinations = GetScopeCombinaisonListFor(NonAssignedMandatoryRequirements, allVariationPoints);
            var projectDistinctCombinations = BuildDeepCopyFrom(projectNonAssignedCombinations);
            //Totals
            var combinationsWithAllMandatory = new List<int[]>(); var versionWithAllMandatoryCounters = new Dictionary<int, int>();
            foreach (var entry in versionMandatoryDictionnary)
            {
                foreach (var combination in versionMandatoryDictionnary[entry.Key])
                {
                    if (FindCombinaisonIndexInto(projectDistinctCombinations, combination) == -1) projectDistinctCombinations.Add(combination);//Distinct
                    if (FindCombinaisonIndexInto(projectNonAssignedCombinations,combination) == -1)//Only Count alternative when not Mandatory Combination is missing
                    {
                        if (FindCombinaisonLastKeyInto(versionMandatoryDictionnary, combination) == entry.Key)//Only Count alternative when Not Mandatory Combination is completed by next versions
                        {
                            if (FindCombinaisonIndexInto(combinationsWithAllMandatory, combination) == -1) combinationsWithAllMandatory.Add(combination);//Distinct
                        }
                    }
                }
                versionWithAllMandatoryCounters.Add(entry.Key, combinationsWithAllMandatory.Count);
            }
            //VM
            List<ProductViewModel> result = new List<ProductViewModel>();
            foreach (ProjectProduct rsc in projectRepository.GetAllProductsFor(ProjectId).OrderByDescending(x => x.Versions.Count()).ToList())
            {
                var PVM = new ProductViewModel() { ProductID = rsc.Id, Name = rsc.Name, Versions = mappingService.BuildVersionViewModelFor(rsc.Versions.OrderByDescending(x => x.ReleasedYear).ThenByDescending(x => x.ReleasedMonth).ToList()) };
                foreach (VersionViewModel version in PVM.Versions.OrderBy(x => x.NumberName))
                {
                    version.MonthName = MonthNames[version.ReleasedMonth -1];
                    version.ProgressName = ProgressNames[version.VersionEnumType - 1 ];
                    version.IsInProgress = version.VersionEnumType == (short)VersionEnumType.InProgress;
                    version.CompletedAlternativeCount = versionWithAllMandatoryCounters[version.VersionID];
                    version.AlternativeCount = projectDistinctCombinations.Count();
                }
                result.Add(PVM);
            }
            return result;
        }
        public RequirementFunnel GetRequirementFunnelViewModelFor(int ProjectId)
        {
            var AllRequirements = projectRepository.GetAllBehaviorRequirementsFor(ProjectId).ToList();
            var PlannedRequirements = new List<int>();
            var CompletedRequirements = new List<int>();
            var ReleasedRequirements = new List<int>();
            var AllVersions = projectRepository.GetAllVersionFor(ProjectId);
            foreach (ProjectVersion version in AllVersions.OrderBy(x => x.NumberName))
            {
                switch (version.VersionEnumType)
                {
                    case (short)VersionEnumType.Planned:
                        PlannedRequirements.AddRange(version.Requirements.Select(x => x.Id));
                        break;
                    case (short)VersionEnumType.InProgress:
                        PlannedRequirements.AddRange(version.Requirements.Select(x => x.Id));
                        break;
                    case (short)VersionEnumType.Completed:
                        CompletedRequirements.AddRange(version.Requirements.Select(x => x.Id));
                        break;
                    case (short)VersionEnumType.Released:
                        ReleasedRequirements.AddRange(version.Requirements.Select(x => x.Id));
                        break;
                    default:
                        break;
                }
            }
            decimal AllRequirementsTotal = AllRequirements.Count;
            decimal UCTotal = projectRepository.GetAllUseCaseDefinitionsFor(ProjectId).Count;
            decimal UCWithRequirementTotal = AllRequirements.GroupBy(r => r.UseCase.Id).Count();
            decimal ReleasedRequirementsTotal = ReleasedRequirements.Distinct().Count();
            decimal CompletedRequirementsTotal = ReleasedRequirementsTotal + CompletedRequirements.Distinct().Count();
            decimal PlannedRequirementsTotal = ReleasedRequirementsTotal + CompletedRequirementsTotal + PlannedRequirements.Distinct().Count();
            RequirementFunnel result = new RequirementFunnel();
            if (UCTotal > 0) result.RequiredUCPercent = (int)Math.Round(UCWithRequirementTotal / UCTotal * 100, 0);
            if (AllRequirementsTotal > 0) {
                result.PlannedPercent = (int)Math.Round((PlannedRequirementsTotal / AllRequirementsTotal) * result.RequiredUCPercent); 
                result.CompletedPercent = (int)Math.Round((CompletedRequirementsTotal / AllRequirementsTotal) * result.RequiredUCPercent);
                result.ReleasedPercent = (int)Math.Round((ReleasedRequirementsTotal / AllRequirementsTotal) * result.RequiredUCPercent);
            } 
            return result;
        }

        public VersionEditorViewModel GetVersionEditorViewModelFor(int VersionId)
        {
            ProjectVersion version = projectRepository.GetVersion(VersionId);
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(version.Product.Project.Id).Where(x => x.Id == version.Product.Id).ToList();
            List<ProjectContextType> allVariationPoints = projectRepository.GetAllVariationPointsFor(version.Product.Project.Id).Where(v => v.UsedAsProductAlternative).ToList();
            var editorVM = new VersionEditorViewModel();
            editorVM.ProjectID = version.Product.Project.Id;
            editorVM.Definition = mappingService.BuildVersionViewModelFor(version);//VersionViewModel
            editorVM.SelectedRequirements = mappingService.BuildRequirementViewModelFor(projectRepository.GetAllBehaviorRequirementsFor(editorVM.ProjectID, version.Product.Id, VersionId).ToList(), ProjectProducts, allVariationPoints);
            editorVM.PendingProductRequirements = mappingService.BuildRequirementViewModelFor(projectRepository.GetAllBehaviorRequirementsFor(editorVM.ProjectID, version.Product.Id, 0).ToList(), ProjectProducts, allVariationPoints);
            var alternativeRequirements = projectRepository.GetAllBehaviorRequirementsFor(editorVM.ProjectID).Where(x => x.IsAlternative).ToList();
            editorVM.ProductAlternatives = mappingService.BuildItemViewModelFor(GetProductAlternativeViewModelsFor(allVariationPoints, alternativeRequirements, new List<ProjectProduct>()));
            editorVM.ProjectProducts = mappingService.BuildItemViewModelFor(projectRepository.GetAllProductsFor(editorVM.ProjectID).ToList());
            return editorVM;
        }

        public AnalysisMatrixViewModel GetAnalysisMatrixViewModelFor(int ProjectId)
        {
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(ProjectId); 
            var allRequirements = projectRepository.GetAllBehaviorRequirementsFor(ProjectId);
            var allVariationPoints = projectRepository.GetAllVariationPointsFor(ProjectId).Where(v => v.UsedAsProductAlternative).ToList();
            var alternativeRequirements = allRequirements.Where(x => x.IsAlternative).ToList();
            var alternativeDefaultRequirementIds = alternativeRequirements.Select(x => x.DefaultBehavior.Id).ToList();
            var alternativeCombinations = GetScopeCombinaisonListFor(alternativeRequirements, allVariationPoints);
            var editorVM = new AnalysisMatrixViewModel();
            editorVM.ProjectID = ProjectId;
            editorVM.DefaultRequirements = mappingService.BuildRequirementViewModelFor(allRequirements.Where(x=> alternativeDefaultRequirementIds.Contains(x.Id)).ToList(), ProjectProducts, allVariationPoints);
            editorVM.ProductAlternatives = GetProductAlternativeViewModelsFor(allVariationPoints, alternativeRequirements, ProjectProducts);
            editorVM.ProjectProducts = mappingService.BuildItemViewModelFor(projectRepository.GetAllProductsFor(editorVM.ProjectID).ToList());
            editorVM.ProjecVersions = mappingService.BuildItemViewModelFor(projectRepository.GetAllVersionFor(editorVM.ProjectID).ToList());
            //editorVM.VariationPoints = mappingService.BuildProjectContextTypeViewModelFor(allVariationPoints);
            return editorVM;
        }

        public BusinessLayerScaffold GetBusinessLayerScaffoldFor(int ProjectId, TemporaryFolder templateArchive)
        {
            List<DomainConceptFacade> AllConcepts = projectRepository.GetAllDomainConcepts(ProjectId).ToList();
            List<RessourceDefinition> AllInfrastructures = projectRepository.GetAllInfrastructuresFor(ProjectId).ToList();
            List<RessourceAssociation> AllAggregations = projectRepository.GetAllAssociationsFor(ProjectId).ToList();
            List<RessourceRequirement> AllBehaviors = projectRepository.GetAllBehaviorRequirementsFor(ProjectId).ToList();
            List<ProjectContext> AllAlternativeVariants = projectRepository.GetAllVariantsFor(ProjectId).ToList();
            BusinessLayerScaffold result = new BusinessLayerScaffold(AllConcepts, AllInfrastructures, AllAggregations, AllBehaviors, AllAlternativeVariants, templateArchive);
            result.BuildAll();
            return result;
        }

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
            List<RessourceAssociation> parentAggregations = ressourceRepository.GetAllParentAggregationsFor(ConceptId).ToList();
            DomainConceptFacade concept = new DomainConceptFacade(ressourceRepository.Get(ConceptId), childrenAggregations, parentAggregations, ressourceRepository.GetAllBehaviorRequirementsForConcept(ConceptId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(concept.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(concept.Definition.Project.Id);
            var editorVM = new DomainConceptEditorViewModel();
            editorVM.ProjectID = concept.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(concept.Definition);
            editorVM.HasOne = mappingService.BuildRessourceAssociationViewModelFor(concept.GetChildrenAggregatedAs(AssociationEnumType.HasOne));
            editorVM.HasMany = mappingService.BuildRessourceAssociationViewModelFor(concept.GetChildrenAggregatedAs(AssociationEnumType.HasMany));
            editorVM.PartOf = mappingService.BuildRessourceAssociationViewModelFor(concept.GetParentAggregatedAs(AssociationEnumType.HasOne));
            editorVM.PartsOf = mappingService.BuildRessourceAssociationViewModelFor(concept.GetParentAggregatedAs(AssociationEnumType.HasMany));
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(concept.Requirements, ProjectProducts, VariationPoints);
            editorVM.Alternatives = mappingService.BuildRequirementViewModelFor(concept.Alternatives, ProjectProducts, VariationPoints);
            editorVM.ProjectConcepts = mappingService.BuildItemViewModelFor(projectRepository.GetAllConceptDefinitionsFor(editorVM.ProjectID).ToList());
            editorVM.ProjectDomainContexts = mappingService.BuildItemViewModelFor(projectRepository.GetAllDomainContexts(editorVM.ProjectID).ToList());
            return editorVM;
        }
        public UseCaseEditorViewModel GetUseCaseEditorViewModelFor(int FunctionId)
        {
            UseCaseFacade uc = new UseCaseFacade( ressourceRepository.Get(FunctionId), ressourceRepository.GetAllBehaviorRequirementsForUC(FunctionId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(uc.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(uc.Definition.Project.Id);
            var editorVM = new UseCaseEditorViewModel();
            editorVM.ProjectID = uc.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(uc.Definition);
            editorVM.Scenarios = mappingService.BuildRequirementViewModelFor(uc.Scenarios, null, null);
            editorVM.UISteps = mappingService.BuildRessourceAssociationViewModelFor(uc.UISteps);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(uc.Requirements, ProjectProducts, VariationPoints);
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
            UIComponentFacade component = new UIComponentFacade(ressourceRepository.Get(UIComponentId), ressourceRepository.GetAllBehaviorRequirementsForUI(UIComponentId));
            List<ProjectContextType> VariationPoints = projectRepository.GetAllVariationPointsFor(component.Definition.Project.Id).ToList();
            List<ProjectProduct> ProjectProducts = projectRepository.GetAllProductsFor(component.Definition.Project.Id);
            var editorVM = new UIComponentEditorViewModel();
            editorVM.ProjectID = component.Definition.Project.Id;
            editorVM.Definition = mappingService.BuildRessourceDefinitionViewModelFor(component.Definition);
            //editorVM.Screens = mappingService.BuildRequirementViewModelFor(component.Screens, null, null);
            //editorVM.Fields = mappingService.BuildRequirementViewModelFor(component.Fields, null, null);
            editorVM.Requirements = mappingService.BuildRequirementViewModelFor(component.Requirements, ProjectProducts, VariationPoints);
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
            assoc.Parent = ressourceRepository.GetDefinition(viewModel.ParentID, EntityState.Unchanged);
            assoc.Ressource = ressourceRepository.GetDefinition(viewModel.RessourceID, EntityState.Unchanged);
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
            var variantIds = viewModel.ScopeIDs;
            requirement.Variants = projectRepository.GetAllVariantsFor(ProjectID, EntityState.Unchanged).Where(x => variantIds.Contains(x.Id)).ToList();
            Change(requirement, UserId, true);
            if (requirement.IsAlternative)
            {
                RessourceRequirement defaultRequirement = ressourceRepository.GetRequirement(viewModel.DefaultBehaviorID);
                requirement.UseCase = defaultRequirement.UseCase;
                requirement.Concept = defaultRequirement.Concept;
                requirement.UI = defaultRequirement.UI;
                requirement.Infrastructure = defaultRequirement.Infrastructure;
            }
            else if (requirement.RequirementEnumType ==  (short)RequirementEnumType.Default)
            {
                if (viewModel.UseCaseID > 0) requirement.UseCase = ressourceRepository.GetDefinition(viewModel.UseCaseID, EntityState.Unchanged);
                if (viewModel.ConceptID > 0) requirement.Concept = ressourceRepository.GetDefinition(viewModel.ConceptID, EntityState.Unchanged);
                if (viewModel.UIID > 0) requirement.UI = ressourceRepository.GetDefinition(viewModel.UIID, EntityState.Unchanged);
                if (viewModel.InfrastructureID > 0) requirement.Infrastructure = ressourceRepository.GetDefinition(viewModel.InfrastructureID, EntityState.Unchanged);

                //TODO trigger changes after VM update
                //List<RessourceRequirement> altRequirements = projectRepository.GetAlternativeRequirementFor(viewModel.DefaultBehaviorID);
                //foreach (var altRequirement in altRequirements)
                //{
                //    altRequirement.UseCase = requirement.UseCase;
                //    altRequirement.Concept = requirement.Concept;
                //    altRequirement.UI = requirement.UI;
                //    altRequirement.Infrastructure = requirement.Infrastructure;
                //    ressourceRepository.Update(altRequirement);
                //    Variants
                //}
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
            //RessourceDefinition ress = ressourceRepository.GetDefinition(ressourceID);
            //ress.Associations.Remove(ass);
            ressourceRepository.Remove(ass);
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