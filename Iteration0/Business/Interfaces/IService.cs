using System;
using System.Collections.Generic;
using System.Linq;
using Iteration0.Business.Services;
using Iteration0.Data.Repositories;
using Iteration0.Business.Domain;

using Iteration0.Business.Domain.Entities;
using Iteration0.ViewModels;
using Iteration0.Business.Infrastructure;

namespace Iteration0.Business.Interfaces
{

    public interface IUserService //: IService<UserModel, Identity_User, IUsers>
    {
    }
    public interface IProjectService
    {
        void ConfigureDependencies(IProjectRepository SvcProjectRepository, IRessourceRepository ressourceRepository, IMappingService SvcMapperService);

        //Reader
        BusinessLayerScaffold GetBusinessLayerScaffoldFor(int ProjectId, TemporaryFolder templateArchive);
        List<ProjectSummaryViewModel> SummarizeAllProjects();
        BoardEditorViewModel GetDomainConceptsBoardEditorViewModelFor(int ProjectId);
        BoardEditorViewModel GetUseCasesBoardEditorViewModelFor(int ProjectId);
        BoardEditorViewModel GetUIComponentsBoardEditorViewModelFor(int ProjectId);
        List<ProductViewModel> GetProductViewModelsFor(int  ProjectID);
        RequirementFunnel GetRequirementFunnelViewModelFor(int ProjectID);
        RessourceDefinitionViewModel GetRessourceDefinitionFor(int RessourceId);
        ProjectEditorViewModel GetProjectEditorViewModelFor(int ProjectId);
        VersionEditorViewModel GetVersionEditorViewModelFor(int VersionId);
        AnalysisMatrixViewModel GetAnalysisMatrixViewModelFor(int ProjectId);
        List<SearchResultViewModel> GetSearchResultViewModelsFor(int ProjectId, string Query);        
        DocumentViewModel GetGlossaryDocumentViewModelFor(int projectID);
        DocumentViewModel GetUseCasesDocumentViewModelFor(int projectID);
        DocumentViewModel GetUIsDocumentViewModelFor(int projectID);
        dynamic GetRessourceEditorViewModelFor(int RessourceId);
        DomainConceptEditorViewModel GetDomainConceptEditorViewModelFor(int ConceptId);
        UseCaseEditorViewModel GetUseCaseEditorViewModelFor(int UseCaseId);
        SpecificationViewModel GetSpecificationViewModelFor(int requirementID);
        UIComponentEditorViewModel GetUIComponentEditorViewModelFor(int UIComponentId);
        List<ItemViewModel> GetAllProjectAsItemViewModel();
        List<ItemViewModel> GetAllUseCaseViewModelsFor(int ProjectId);
        List<ItemViewModel> GetAllSpecificationViewModelsFor(int ProjectId);
        List<RessourceAssociationViewModel> GetAllAssociationViewModelsFor(int ProjectId);
        List<VersionViewModel> GetAllVersionViewModelsFor(int ProjectId);



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
        void CreateEditRessourceRequirementWith(ref SpecificationViewModel viewModel, int UserId, int ProjectID);
        void CreateEditProjectContextTypesWith(ref ProjectContextTypeViewModel viewModel, int UserId, int ProjectID);
        void CreateEditProjectContextsWith(ref ProjectContextViewModel viewModel, int UserId, int ProjectID);
        void CreateEditProjectProductWith(ref ItemViewModel viewModel, int UserId, int ProjectID);
        void CreateEditVersionRequirementWith(ref ItemViewModelList viewModel, int UserId, int ProjectID);        
        void CreateEditProjectVersionsWith(ref VersionViewModel viewModel, int UserId, int ProjectID);
    }
    public interface IFileStorageService
    {
        void ConfigurePathsWith(String fileStoragePath);
        TemporaryFolder GetTemporaryFolderFor(String archiveTemplatePath);
        String GetTemporaryZIPArchivePathFor(String archiveFolderPath);
    }

    public interface IMappingService
    {
        //->VIEW
        ProjectDefinitionFormViewModel BuildProjectDefinitionFormViewModelFor(ProjectDefinition source);
        List<ProjectContextTypeViewModel> BuildProjectContextTypeViewModelFor(List<ProjectContextType> source);
        VersionViewModel BuildVersionViewModelFor(ProjectVersion source);
        List<VersionViewModel> BuildVersionViewModelFor(List<ProjectVersion> source);
        //List<VersionSpecificationViewModel> BuildRessourceVersionSpecificationViewModelFor(List<VersionRequirement> source);
        RessourceDefinitionViewModel BuildRessourceDefinitionViewModelFor(RessourceDefinition source);
        List<RessourceDefinitionViewModel> BuildRessourceDefinitionViewModelFor(List<RessourceDefinition> source);
        List<RessourceAssociationViewModel> BuildRessourceAssociationViewModelFor(List<RessourceAssociation> source);
        SpecificationViewModel BuildSpecificationViewModelFor(RessourceRequirement source);
        List<SpecificationViewModel> BuildSpecificationViewModelFor(List<RessourceRequirement> source, List<ProjectProduct> ProjectProducts, List<ProjectContextType> VariationPoints);
        List<ProjectContextViewModel> BuildProjectContextViewModelFor(List<ProjectContext> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectContextType> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectVersion> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectContext> source);
        List<ItemViewModel> BuildItemViewModelFor(List<RessourceDefinition> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProjectProduct> source);
        List<ItemViewModel> BuildItemViewModelFor(List<RessourceRequirement> source);
        List<ItemViewModel> BuildItemViewModelFor(List<ProductAlternativeViewModel> source);        
        List<BoardPoolViewModel> BuildBoardPoolViewModelFor(List<ItemViewModel> Pools, List<RessourceDefinition> Ressources);

        //->BUSINESS
        ProjectDefinition ReBuildProjectDefinitionWithViewModel(ProjectDefinitionFormViewModel source);
        ProjectContextType ReBuildProjectContextTypeWithViewModel(ProjectContextTypeViewModel source);
        ProjectContext ReBuildProjectContextWithViewModel(ProjectContextViewModel source);
        ProjectVersion ReBuildProjectContextTypeWithViewModel(VersionViewModel source);
        //VersionRequirement ReBuildVersionRequirementWithViewModel(VersionSpecificationViewModel source);
        RessourceDefinition ReBuildRessourceDefinitionWithViewModel(RessourceDefinitionViewModel source);
        RessourceDefinition ReBuildRessourceDefinitionWithViewModel(ItemViewModel source);
        RessourceAssociation ReBuildRessourceAssociationWithViewModel(RessourceAssociationViewModel source);
        RessourceRequirement ReBuildRessourceRequirementWithViewModel(SpecificationViewModel source);
        //RequiremenContext ReBuildRessourceRequirementContextWithViewModel(SpecificationViewModel source);
        ProjectProduct ReBuildProjectProductWithViewModel(ItemViewModel source);
        ProjectVersion ReBuildProjectVersionWithViewModel(VersionViewModel source);    
    }

}
