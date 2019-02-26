using AutoMapper;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Domain;
using Iteration0.Business.Domain.Entities;
using Iteration0.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace Iteration0.Business.Services
{

    public class MappingService : IMappingService
    {
    public MappingService()
        {
        }

    public ProjectDefinitionFormViewModel BuildProjectDefinitionFormViewModelFor(ProjectDefinition source)
    {
        return Mapper.Map<ProjectDefinition, ProjectDefinitionFormViewModel>(source);
    }

        public List<ProjectContextTypeViewModel> BuildProjectContextTypeViewModelFor(List<ProjectContextType> source)//, ProjectContext sourceDependency)
    { 
        var results = new List<ProjectContextTypeViewModel>();
        foreach (ProjectContextType entity in source)
        {
            var result = Mapper.Map<ProjectContextType, ProjectContextTypeViewModel>(entity);
            results.Add(result);
        }
            return results;
    }

        public RequirementViewModel BuildRequirementViewModelFor(RessourceRequirement source)
        {
            return Mapper.Map<RessourceRequirement, RequirementViewModel>(source);
        }

        public RessourceDefinitionViewModel BuildRessourceDefinitionViewModelFor(RessourceDefinition source)
        {
            return Mapper.Map<RessourceDefinition, RessourceDefinitionViewModel>(source);
        }


        public ProjectContextType ReBuildProjectContextTypeWithViewModel(ProjectContextTypeViewModel source)
        {
            return Mapper.Map<ProjectContextTypeViewModel, ProjectContextType>(source);
        }

        public ProjectDefinition ReBuildProjectDefinitionWithViewModel(ProjectDefinitionFormViewModel source)
        {
            return Mapper.Map<ProjectDefinitionFormViewModel, ProjectDefinition>(source);
        }

        public RessourceDefinition ReBuildRessourceDefinitionWithViewModel(RessourceDefinitionViewModel source)
        {
            return Mapper.Map<RessourceDefinitionViewModel, RessourceDefinition>(source);
        }

        //public RequiremenContext ReBuildRessourceRequirementContextWithViewModel(RequirementViewModel source)
        //{
        //    return Mapper.Map<RequirementViewModel, RequiremenContext>(source);
        //}

        public RessourceRequirement ReBuildRessourceRequirementWithViewModel(RequirementViewModel source)
        {
            return Mapper.Map<RequirementViewModel, RessourceRequirement>(source);
        }
        
        public ProjectProduct ReBuildProjectProductWithViewModel(ItemViewModel source)
        {
            return Mapper.Map<ItemViewModel, ProjectProduct>(source);
        }
        public ProjectVersion ReBuildProjectVersionWithViewModel(VersionViewModel source)
        {
            return Mapper.Map<VersionViewModel, ProjectVersion>(source);
        }
        //public VersionRequirement ReBuildVersionRequirementWithViewModel(VersionRequirementViewModel source)
        //{
        //    return Mapper.Map<VersionRequirementViewModel, VersionRequirement>(source);
        //}
        public List<RessourceDefinitionViewModel> BuildRessourceDefinitionViewModelFor(List<RessourceDefinition> source)
        {
            var results = new List<RessourceDefinitionViewModel>();
            foreach (RessourceDefinition entity in source)
            {
                var result = Mapper.Map<RessourceDefinition, RessourceDefinitionViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<RessourceAssociationViewModel> BuildRessourceAssociationViewModelFor(List<RessourceAssociation> source)
        {
            var results = new List<RessourceAssociationViewModel>();
            foreach (RessourceAssociation entity in source)
            {
                var result = Mapper.Map<RessourceAssociation, RessourceAssociationViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<RequirementViewModel> BuildRequirementViewModelFor(List<RessourceRequirement> source)
        {
            var results = new List<RequirementViewModel>();
            foreach (RessourceRequirement entity in source)
            {
                var result = Mapper.Map<RessourceRequirement, RequirementViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<ItemViewModel> BuildItemViewModelFor(List<ProjectProduct> source)
        {
            var results = new List<ItemViewModel>();
            foreach (ProjectProduct entity in source)
            {
                var result = Mapper.Map<ProjectProduct, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<ItemViewModel> BuildItemViewModelFor(List<ProjectContextType> source)
        {
            var results = new List<ItemViewModel>();
            foreach (ProjectContextType entity in source)
            {
                var result = Mapper.Map<ProjectContextType, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }
        
        public List<ProjectContextViewModel> BuildProjectContextViewModelFor(List<ProjectContext> source)
        {
            var results = new List<ProjectContextViewModel>();
            foreach (ProjectContext entity in source)
            {
                var result = Mapper.Map<ProjectContext, ProjectContextViewModel>(entity);
                results.Add(result);
            }
            return results;
        }
        public List<ItemViewModel> BuildItemViewModelFor(List<ProjectContext> source)
        {
            var results = new List<ItemViewModel>();
            foreach (ProjectContext entity in source)
            {
                var result = Mapper.Map<ProjectContext, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<ItemViewModel> BuildItemViewModelFor(List<RessourceDefinition> source)
        {
            var results = new List<ItemViewModel>();
            foreach (RessourceDefinition entity in source)
            {
                var result = Mapper.Map<RessourceDefinition, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public RessourceAssociation ReBuildRessourceAssociationWithViewModel(RessourceAssociationViewModel source)
        {
            return Mapper.Map<RessourceAssociationViewModel, RessourceAssociation>(source);
        }
        public List<VersionViewModel> BuildVersionViewModelFor(List<ProjectVersion> source)
        {
            var results = new List<VersionViewModel>();
            foreach (ProjectVersion entity in source)
            {
                var result = Mapper.Map<ProjectVersion, VersionViewModel>(entity);
                results.Add(result);
            }
            return results;
        }
        public VersionViewModel BuildVersionViewModelFor(ProjectVersion source)
        {
            return Mapper.Map<ProjectVersion, VersionViewModel>(source);
        }
        //public List<VersionRequirementViewModel> BuildRessourceVersionRequirementViewModelFor(List<VersionRequirement> source)
        //{
        //    var results = new List<VersionRequirementViewModel>();
        //    foreach (VersionRequirement entity in source)
        //    {
        //        var result = Mapper.Map<VersionRequirement, VersionRequirementViewModel>(entity);
        //        results.Add(result);
        //    }
        //    return results;
        //}

        public ProjectVersion ReBuildProjectContextTypeWithViewModel(VersionViewModel source)
        {
            return Mapper.Map<VersionViewModel,ProjectVersion>(source);
        }

        public ProjectContext ReBuildProjectContextWithViewModel(ProjectContextViewModel source)
        {
            return Mapper.Map<ProjectContextViewModel, ProjectContext>(source);
        }

        public List<BoardPoolViewModel> BuildBoardPoolViewModelFor(List<ItemViewModel> Pools, List<RessourceDefinition> Ressources)
        {
            var result = new List<BoardPoolViewModel>();
            Ressources= Ressources.OrderBy(x => x.Context.SortOrder).ThenBy(y => y.StepOrder).ThenBy(y => y.ScaleOrder).ThenBy(y => y.SortOrder).ThenBy(y => y.Name).ToList();//NB! Order is important for board mapping
            foreach (ItemViewModel itm in Pools)
            {
                var poolRessources = Ressources.Where(x => x.Context.Id.ToString() == itm.KeyValue).ToList();
                var pool = new BoardPoolViewModel();
                pool.PoolName = itm.Label; //pool.PoolID = itm.KeyValue;
                pool.Steps = new List<BoardPoolStepViewModel>();

                if (poolRessources.Count > 0) {
                    var stepCounter = poolRessources.First().StepOrder;
                    var step = new BoardPoolStepViewModel() { Scale1Items=new List<BoardItemViewModel>(), Scale2Items = new List<BoardItemViewModel>()};
                    foreach (RessourceDefinition rsc in poolRessources)
                    {
                        if (rsc.StepOrder > stepCounter)
                        {
                            pool.Steps.Add(step);
                            step = new BoardPoolStepViewModel() { Scale1Items = new List<BoardItemViewModel>(), Scale2Items = new List<BoardItemViewModel>() };
                            stepCounter = rsc.StepOrder;
                        }
                        if (rsc.ScaleOrder == 1)
                        {
                            step.Scale1Items.Add(Mapper.Map<RessourceDefinition, BoardItemViewModel>(rsc));
                        } else
                        {
                            step.Scale2Items.Add(Mapper.Map<RessourceDefinition, BoardItemViewModel>(rsc));
                        }
                    }
                    pool.Steps.Add(step);
                }
                result.Add(pool);
            }
            return result;
        }
    }
}