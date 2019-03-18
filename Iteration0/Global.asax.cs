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
            MappingService.InitializeAutoMapper();
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

    }
}
