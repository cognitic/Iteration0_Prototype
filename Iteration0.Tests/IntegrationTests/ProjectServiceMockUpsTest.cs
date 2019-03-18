using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Iteration0;
using Iteration0.Controllers;
using Iteration0.Business.Services;
using Iteration0.Data.Repositories;

namespace Iteration0.Tests.IntegrationTests
{
    [TestClass]
    public class ProjectServiceMockUpsTest
    {

        ProjectService _projectService;

        [TestInitialize]
        public void SetUpFixture()
        {
            MappingService.InitializeAutoMapper();
            _projectService = new ProjectService();
            //_projectService.ConfigureDependencies(new ProjectRepositoryMockUp(), new RessourceRepositoryMockUp(), new MappingService());
        }
        [ClassCleanup]
        public static void TearDown()
        {

        }

    }
}
