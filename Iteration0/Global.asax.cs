using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.Mvc;
using Iteration0.Business.Services;
using Iteration0.Business.Interfaces;
using Iteration0.Data.Repositories;
using AutoMapper;
using Iteration0.Business.Domain.Entities;
using Iteration0.ViewModels;

namespace Iteration0
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            Automapper_start();
            // Register MVC-related dependencies.
            var builder = new ContainerBuilder();
            builder.RegisterType<ProjectRepository>().As<IProjectRepository>();
            builder.RegisterType<RessourceRepository>().As<IRessourceRepository>();
            builder.RegisterType<MappingService>().As<IMappingService>();
            builder.RegisterType<MockUpGeneratorService>().As<IMockUpGeneratorService>();
            builder.RegisterType<UserService>().As<IUserService>();
            builder.RegisterType<ProjectService>().As<IProjectService>();
            //builder.Register(c => new LogManager(DateTime.Now))
            //       .As<ILogger>();
            builder.RegisterControllers(typeof(MvcApplication).Assembly);
            //builder.RegisterModelBinders(typeof(MvcApplication).Assembly);
            //builder.RegisterModelBinderProvider();            
            // Set the MVC dependency resolver to use Autofac.
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        void Session_Start(object sender, EventArgs e)
        {
            Session["UserName"] = "Anonymous"; //UserService.getuserInfoFromUserTable()
            Session["UserID"] = 1;
            Session["CustomCSSRules"] = "";
        }

        /// <summary>
        /// Handles appliction-level errors by passing them through the Log Service.
        /// </summary>
        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            System.Diagnostics.Debug.WriteLine(exception);
            //Response.Redirect("/Project/Index");


            //var originalException = Server.GetLastError();
            //var exceptionManager = (ExceptionManager)null;
            //try
            //{
            //    exceptionManager = DependencyResolver.Current.GetService<ExceptionManager>();
            //}
            //catch (Exception ex)
            //{
            //    Trace.TraceError("An error occurred in resolving the Enterprise Library exception manager: " + ex.Message);
            //    return;
            //}
            //if (exceptionManager == null)
            //{
            //    Trace.TraceError("The Enterprise Library Exception Handling block is not registered with the current Dependency Resolver. Check your Dependency Resolver registrations.");
            //    return;
            //}

            //var exceptionToThrow = (Exception)null;
            //if (!exceptionManager.HandleException(originalException, "Global Web Exception Policy", out exceptionToThrow))
            //{
            //    Server.ClearError();
            //}
            //else if (HttpContext.Current != null && exceptionToThrow != null && exceptionToThrow != originalException)
            //{
            //    HttpContext.Current.AddError(exceptionToThrow);
            //}
        }

        void Automapper_start()
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
                cfg.CreateMap<RessourceDefinition, RessourceDefinitionViewModel>()
                    .ForMember(dest => dest.RessourceID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<RessourceRequirement, RequirementViewModel>()
                    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.RessourceID, opts => opts.MapFrom(src => src.Ressource.Id))
                    .ReverseMap();
                cfg.CreateMap<RessourceDefinition, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ReverseMap();
                //cfg.CreateMap<RequiremenContext, RequirementViewModel>()
                //    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Id))                  
                //    .ReverseMap();
                cfg.CreateMap<RessourceAssociation, RessourceAssociationViewModel>()
                    .ForMember(dest => dest.AssociationId, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.RessourceID, opts => opts.MapFrom(src => src.Ressource.Id))
                    .ForMember(dest => dest.ParentID, opts => opts.MapFrom(src => src.Parent.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectVersion, VersionViewModel>()
                    .ForMember(dest => dest.VersionID, opts => opts.MapFrom(src => src.Id))
                    .ReverseMap();
                cfg.CreateMap<ProjectProduct, ItemViewModel>()
                    .ForMember(dest => dest.KeyValue, opts => opts.MapFrom(src => src.Id))
                    .ForMember(dest => dest.Tooltip, opts => opts.MapFrom(src => src.Mission))
                    .ForMember(dest => dest.Label, opts => opts.MapFrom(src => src.Name))
                    .ReverseMap();
                cfg.CreateMap<RessourceDefinition, BoardItemViewModel>()
                .ForMember(dest => dest.ItemID, opts => opts.MapFrom(src => src.Id))
                .ForMember(dest => dest.PoolID, opts => opts.MapFrom(src => src.Context.Id))
                .ForMember(dest => dest.ItemType, opts => opts.MapFrom(src => src.RessourceEnumType))
                .ReverseMap();
                //rsc.Name = formVM.Name; rsc.ProjectContextId = formVM.PoolID; rsc.ScaleOrder = formVM.ScaleOrder; rsc.StepOrder = formVM.StepOrder; rsc.SortOrder = formVM.SortOrder;
                //cfg.CreateMap<VersionRequirement, VersionRequirementViewModel>()
                //    .ForMember(dest => dest.VersionID, opts => opts.MapFrom(src => src.Version.Id))
                //    .ForMember(dest => dest.RequirementID, opts => opts.MapFrom(src => src.Requirement.Id))
                //    .ReverseMap();
            });
        }

    }
}
