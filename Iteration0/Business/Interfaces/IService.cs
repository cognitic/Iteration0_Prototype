using System;
using System.Collections.Generic;
using System.Linq;
using Iteration0.Business.Services;
using Iteration0.Data.Repositories;
using Iteration0.Business.Domain;

using Iteration0.Business.Domain.Entities;
using Iteration0.ViewModels;

namespace Iteration0.Business.Interfaces
{

    public interface IUserService //: IService<UserModel, Identity_User, IUsers>
    {
    }
    public interface IProjectService
    {
        void ConfigureDependencies(IProjectRepository SvcProjectRepository, IRessourceRepository ressourceRepository, IMappingService SvcMapperService);
        //bool Validate(ProjectEditorViewModel projectEditorViewModel);
        //Reader
        List<ProjectSummaryViewModel> SummarizeAllProjects();
        BoardEditorViewModel GetDomainConceptsBoardEditorViewModelFor(int ProjectId);
        BoardEditorViewModel GetUseCasesBoardEditorViewModelFor(int ProjectId);
        BoardEditorViewModel GetUIComponentsBoardEditorViewModelFor(int ProjectId);
        //List<ConceptSummaryViewModel> SummarizeAllConceptsFor(int ProjectId);
        //List<FunctionSummaryViewModel> SummarizeAllUseCasesFor(int ProjectId);
        //List<ComponentSummaryViewModel> SummarizeAllUIComponentFor(int ProjectId);
        //List<ProjectHistoryViewModel> SummarizeProjectHistoryFor(int ProjectId);
        List<ProductViewModel> GetProductViewModelFor(int  ProjectID);
        RessourceDefinitionViewModel GetRessourceDefinitionFor(int RessourceId);
        ProjectEditorViewModel GetProjectEditorViewModelFor(int ProjectId);
        VersionEditorViewModel GetVersionEditorViewModelFor(int VersionId);
        dynamic GetRessourceEditorViewModelFor(int RessourceId);
        DomainConceptEditorViewModel GetDomainConceptEditorViewModelFor(int ConceptId);
        UseCaseEditorViewModel GetUseCaseEditorViewModelFor(int UseCaseId);
        UIComponentEditorViewModel GetUIComponentEditorViewModelFor(int UIComponentId);
        List<ItemViewModel> GetAllProjectAsItemViewModel();

        //Writer
        void RemoveProjectContextWith(int contextID, int ProjectID, int UserId);
        void RemoveProjectContextTypeWith(int contextTypeID, int ProjectID, int UserId);
        void RemoveProductWith(int productID, int ProjectID, int UserId);
        void RemoveProjectVersionWith(int versionID, int ProjectID, int UserId);
        void RemoveVersionRequirementWith(int requirementID, int versionID, int UserId);
        void RemoveRemoveRessourceDefinition(int ressourceID, int ProjectID, int UserId);
        void RemoveRessourceAssociationWith(int associationID, int ressourceID, int UserId);
        void RemoveRessourceRequirementWith(int requirementID, int ProjectID, int UserId);
        void CreateEditProjectDefinitionWith(ref ProjectDefinitionFormViewModel viewModel, int UserId, int ProjectID);
        void CreateEditRessouceDefinitionWith(ref RessourceDefinitionViewModel viewModel, int UserId, int ProjectID);
        void CreateEditRessouceAssociationWith(ref RessourceAssociationViewModel viewModel, int UserId, int ProjectID);
        void CreateEditRessourceRequirementWith(ref RequirementViewModel viewModel, int UserId, int ProjectID);
        //void CreateEditRessourceAssociationWith(RessourceDefinitionViewModel viewModel, int UserId);
        void CreateEditProjectContextTypesWith(ref ProjectContextTypeViewModel viewModel, int UserId, int ProjectID);
        void CreateEditProjectContextsWith(ref ProjectContextViewModel viewModel, int UserId, int ProjectID);
        void CreateEditProjectProductWith(ref ItemViewModel viewModel, int UserId, int ProjectID);
        void CreateEditVersionRequirementWithWith(ref ItemViewModel viewModel, int UserId, int ProjectID);        
        void CreateEditProjectVersionsWith(ref VersionViewModel viewModel, int UserId, int ProjectID);
    }
    public interface IMockUpGeneratorService
    {
    }
    public interface IMappingService
    {
        //->VIEW
        ProjectDefinitionFormViewModel BuildProjectDefinitionFormViewModelFor(ProjectDefinition source);
        List<ProjectContextTypeViewModel> BuildProjectContextTypeViewModelFor(List<ProjectContextType> source);
        VersionViewModel BuildVersionViewModelFor(ProjectVersion source);
        List<VersionViewModel> BuildVersionViewModelFor(List<ProjectVersion> source);
        //List<VersionRequirementViewModel> BuildRessourceVersionRequirementViewModelFor(List<VersionRequirement> source);
        RessourceDefinitionViewModel BuildRessourceDefinitionViewModelFor(RessourceDefinition source);
        List<RessourceDefinitionViewModel> BuildRessourceDefinitionViewModelFor(List<RessourceDefinition> source);
        List<RessourceAssociationViewModel> BuildRessourceAssociationViewModelFor(List<RessourceAssociation> source);
        RequirementViewModel BuildRequirementViewModelFor(RessourceRequirement source);
        List<RequirementViewModel> BuildRequirementViewModelFor(List<RessourceRequirement> source);
        List<ProjectContextViewModel> BuildProjectContextViewModelFor(List<ProjectContext> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectContextType> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectContext> source);
        List<ItemViewModel> BuildItemViewModelFor(List<RessourceDefinition> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectProduct> source);
        List<BoardPoolViewModel> BuildBoardPoolViewModelFor(List<ItemViewModel> Pools, List<RessourceDefinition> Ressources);

        //->BUSINESS
        ProjectDefinition ReBuildProjectDefinitionWithViewModel(ProjectDefinitionFormViewModel source);
        ProjectContextType ReBuildProjectContextTypeWithViewModel(ProjectContextTypeViewModel source);
        ProjectContext ReBuildProjectContextWithViewModel(ProjectContextViewModel source);
        ProjectVersion ReBuildProjectContextTypeWithViewModel(VersionViewModel source);
        //VersionRequirement ReBuildVersionRequirementWithViewModel(VersionRequirementViewModel source);
        RessourceDefinition ReBuildRessourceDefinitionWithViewModel(RessourceDefinitionViewModel source);
        RessourceAssociation ReBuildRessourceAssociationWithViewModel(RessourceAssociationViewModel source);
        RessourceRequirement ReBuildRessourceRequirementWithViewModel(RequirementViewModel source);
        //RequiremenContext ReBuildRessourceRequirementContextWithViewModel(RequirementViewModel source);
        ProjectProduct ReBuildProjectProductWithViewModel(ItemViewModel source);
        ProjectVersion ReBuildProjectVersionWithViewModel(VersionViewModel source);    
    }

}
