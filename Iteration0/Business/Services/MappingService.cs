using AutoMapper;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Domain;
using Iteration0.Business.Domain.Entities;
using Iteration0.ViewModels;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Iteration0.Business.Services
{
    public class MappingService : IMappingService
    {
        public static void InitializeAutoMapper()
        {
            // Register View Models-related datamapping
            Mapper.Initialize(cfg => {
                //cfg.AddProfile<AppProfile>();
                cfg.CreateMap<ProjectDefinition, ProjectDefinitionFormViewModel>()
                    .ForMember(dest => dest.ProjectID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectContextType, ProjectContextTypeViewModel>()
                    .ForMember(dest => dest.ContextTypeID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectContextType, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ReverseMap();
                cfg.CreateMap<ProjectContext, ProjectContextViewModel>()
                    .ForMember(dest => dest.ContextID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectContext, ItemViewModel>()
                    .ForMember(dest => dest.ParentKeyValue, opts => opts.MapFrom(src => src.Type.Id))
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ForMember(dest => dest.SortOrder, opts => opts.MapFrom(src => src.SortOrder))
                    .ReverseMap();
                cfg.CreateMap<ProjectVersion, ItemViewModel>()
                    .ForMember(dest => dest.ParentKeyValue, opts => opts.MapFrom(src => src.Product.Id))
                    .ForMember(dest => dest.Code, opts => opts.MapFrom(src => src.VersionEnumType))
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.NumberName))
                    .ForMember(dest => dest.SortOrder, opts => opts.MapFrom(src => src.ReleasedYear*100 + src.ReleasedMonth))
                    .ReverseMap();
                cfg.CreateMap<RessourceDefinition, RessourceDefinitionViewModel>()
                    .ForMember(dest => dest.RessourceID, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.ProjectContextName, opts => opts.MapFrom(src => src.Context.Name))
                    .ForMember(dest => dest.ProjectContextId, opts => opts.MapFrom(src => src.Context.Id))
                    .ReverseMap();
                cfg.CreateMap<RessourceRequirement, SpecificationViewModel>()
                    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Name, opts => opts.MapFrom(src => src.Behavior))
                    .ForMember(dest => dest.UseCaseID, opts => opts.MapFrom(src => src.UseCase.Id))
                    .ForMember(dest => dest.UseCase, opts => opts.MapFrom(src => src.UseCase.Name))
                    .ForMember(dest => dest.ConceptID, opts => opts.MapFrom(src => src.Concept.Id))
                    .ForMember(dest => dest.Concept, opts => opts.MapFrom(src => src.Concept.Name))
                    .ForMember(dest => dest.UIID, opts => opts.MapFrom(src => src.UI.Id))
                    .ForMember(dest => dest.UI, opts => opts.MapFrom(src => src.UI.Name))
                    .ForMember(dest => dest.InfrastructureID, opts => opts.MapFrom(src => src.Infrastructure.Id))
                    .ForMember(dest => dest.Infrastructure, opts => opts.MapFrom(src => src.Infrastructure.Name))
                    .ForMember(dest => dest.DefaultSpecificationID, opts => opts.MapFrom(src => src.DefaultBehavior.Id))
                    .ForMember(dest => dest.DefaultSpecification, opts => opts.MapFrom(src => src.DefaultBehavior.Behavior))
                    .ForMember(dest => dest.SelectedVersionIDs, opts => opts.MapFrom(src => src.Versions.Select(x => x.Id)));
                cfg.CreateMap<SpecificationViewModel, RessourceRequirement>()
                    .ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.RequirementID))
                    .ForMember(dest => dest.UseCase, opt => opt.Ignore())
                    .ForMember(dest => dest.Concept, opt => opt.Ignore())
                    .ForMember(dest => dest.UI, opt => opt.Ignore())
                    .ForMember(dest => dest.Infrastructure, opt => opt.Ignore())
                    .ForMember(dest => dest.UseCase, opt => opt.Ignore())
                    .ForMember(dest => dest.Versions, opt => opt.Ignore());
                cfg.CreateMap<RessourceDefinition, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ForMember(dest => dest.Tooltip, opts => opts.MapFrom(src => src.Definition))
                    .ReverseMap();
                //cfg.CreateMap<RequiremenContext, SpecificationViewModel>()
                //    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Id))                  
                //    .ReverseMap();
                cfg.CreateMap<RessourceAssociation, RessourceAssociationViewModel>()
                    .ForMember(dest => dest.AssociationId, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.RessourceID, opts => opts.MapFrom(src => src.Ressource.Id))
                    .ForMember(dest => dest.ParentID, opts => opts.MapFrom(src => src.Parent.Id))
                    .ForMember(dest => dest.ParentName, opts => opts.MapFrom(src => src.Parent.Name))
                    .ForMember(dest => dest.RessourceName, opts => opts.MapFrom(src => src.Ressource.Name))
                    //.ForMember(dest => dest.ParentName, opts => opts.MapFrom(src => src.Parent.Name))
                    .ReverseMap();
                cfg.CreateMap<ProjectVersion, VersionViewModel>()
                    .ForMember(dest => dest.VersionID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectProduct, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Tooltip, opts => opts.MapFrom(src => src.Mission))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ReverseMap();
                cfg.CreateMap<RessourceRequirement, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Tooltip, opts => opts.MapFrom(src => src.Description))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => "#" + src.Id.ToString() + " " + src.Behavior))
                    .ReverseMap();
                cfg.CreateMap<ProductAlternativeViewModel, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => String.Join("_", src.ScopeIDs.ToArray())))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.ScopeSummary))
                    .ReverseMap();                
                cfg.CreateMap<RessourceDefinition, BoardItemViewModel>()
                .ForMember(dest => dest.ItemID, opts => opts.MapFrom(src => src.Id))
                .ForMember(dest => dest.PoolID, opts => opts.MapFrom(src => src.Context.Id))
                .ForMember(dest => dest.ItemType, opts => opts.MapFrom(src => src.RessourceEnumType))
                .ReverseMap();
                //rsc.Name = formVM.Name; rsc.ProjectContextId = formVM.PoolID; rsc.ScaleOrder = formVM.ScaleOrder; rsc.StepOrder = formVM.StepOrder; rsc.SortOrder = formVM.SortOrder;
                //cfg.CreateMap<VersionRequirement, VersionSpecificationViewModel>()
                //    .ForMember(dest => dest.VersionID, opts => opts.MapFrom(src => src.Version.Id))
                //    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Requirement.Id))
                //    .ReverseMap();
            });
        }

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

        public SpecificationViewModel BuildSpecificationViewModelFor(RessourceRequirement source)
        {
            return Mapper.Map<RessourceRequirement, SpecificationViewModel>(source);
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
        public RessourceDefinition ReBuildRessourceDefinitionWithViewModel(ItemViewModel source)
        {
            return Mapper.Map<ItemViewModel, RessourceDefinition>(source);
        }
        
        //public RequiremenContext ReBuildRessourceRequirementContextWithViewModel(SpecificationViewModel source)
        //{
        //    return Mapper.Map<SpecificationViewModel, RequiremenContext>(source);
        //}

        public RessourceRequirement ReBuildRessourceRequirementWithViewModel(SpecificationViewModel source)
        {
            return Mapper.Map<SpecificationViewModel, RessourceRequirement>(source);
        }
        
        public ProjectProduct ReBuildProjectProductWithViewModel(ItemViewModel source)
        {
            return Mapper.Map<ItemViewModel, ProjectProduct>(source);
        }
        public ProjectVersion ReBuildProjectVersionWithViewModel(VersionViewModel source)
        {
            return Mapper.Map<VersionViewModel, ProjectVersion>(source);
        }
        //public VersionRequirement ReBuildVersionRequirementWithViewModel(VersionSpecificationViewModel source)
        //{
        //    return Mapper.Map<VersionSpecificationViewModel, VersionRequirement>(source);
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

        public List<SpecificationViewModel> BuildSpecificationViewModelFor(List<RessourceRequirement> source, List<ProjectProduct>  ProjectProducts, List<ProjectContextType> VariationPoints = null)
        {
            var results = new List<SpecificationViewModel>();
            foreach (RessourceRequirement entity in source)
            {
                var result = Mapper.Map<RessourceRequirement, SpecificationViewModel>(entity);
                    result.ScopeIDs = entity.Variants.Select(x => x.Id).ToList();
                    foreach (ProjectContextType point in VariationPoints)
                    {
                        var pointSummary = string.Join("/", entity.Variants.Where(v => v.Type.Id == point.Id).Select(x => x.CodeName));
                        if (pointSummary.Length > 0)
                        {
                            result.ScopeSummary += pointSummary;
                        }
                }
                if (result.ScopeSummary.Length > 1 && result.ScopeSummary.Substring(result.ScopeSummary.Length - 2, 2) == ", ") { result.ScopeSummary = result.ScopeSummary.Substring(0, result.ScopeSummary.Length - 2); }
                if (!entity.IsAlternative) { result.ScopeSummary = (result.ScopeSummary.Length>0? result.ScopeSummary : "Default"); }
                result.SelectedVersions = new List<string>();
                foreach (ProjectProduct pp in ProjectProducts)
                    {
                        foreach (ProjectVersion pv in pp.Versions)
                        {
                            if (result.SelectedVersionIDs.Contains(pv.Id))
                            {
                                result.IsSelected = true;
                                result.SelectedVersions.Add( pv.NumberName);
                                if (!result.SelectedProductIDs.Contains(pp.Id)) result.SelectedProductIDs.Add(pp.Id);
                            }
                        }
                    }
                
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

        public List<ItemViewModel> BuildItemViewModelFor(List<ProjectVersion> source)
        {
            var results = new List<ItemViewModel>();
            foreach (ProjectVersion entity in source)
            {
                var result = Mapper.Map<ProjectVersion, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<ItemViewModel> BuildItemViewModelFor(List<RessourceRequirement> source)
        {
            var results = new List<ItemViewModel>();
            foreach (RessourceRequirement entity in source)
            {
                var result = Mapper.Map<RessourceRequirement, ItemViewModel>(entity);
                results.Add(result);
            }
            return results;
        }

        public List<ItemViewModel> BuildItemViewModelFor(List<ProductAlternativeViewModel> source)
        {
            var results = new List<ItemViewModel>();
            foreach (ProductAlternativeViewModel entity in source)
            {
                var result = Mapper.Map<ProductAlternativeViewModel, ItemViewModel>(entity);
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
        //public List<VersionSpecificationViewModel> BuildRessourceVersionSpecificationViewModelFor(List<VersionRequirement> source)
        //{
        //    var results = new List<VersionSpecificationViewModel>();
        //    foreach (VersionRequirement entity in source)
        //    {
        //        var result = Mapper.Map<VersionRequirement, VersionSpecificationViewModel>(entity);
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