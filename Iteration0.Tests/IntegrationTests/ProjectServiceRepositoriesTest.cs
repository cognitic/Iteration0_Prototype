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
using Iteration0.ViewModels;

namespace Iteration0.Tests.IntegrationTests
{
    [TestClass]
    public class ProjectServiceRepositoriesTest
    {
        ProjectService _projectService;
        int _projectid;
        int _useCaseid;
        int _requirementid;

        [TestInitialize]
        public void SetUpFixture()
        {
            MappingService.InitializeAutoMapper();
            _projectService = new ProjectService();
            _projectService.ConfigureDependencies(new ProjectRepository(), new RessourceRepository(), new MappingService());
            //TODO add temporary project, usecase and requirement
            _projectid = int.Parse(_projectService.GetAllProjectAsItemViewModel().First().KeyValue);
            _useCaseid = int.Parse(_projectService.GetAllUseCaseViewModelsFor(_projectid).First().KeyValue);
            _requirementid = int.Parse(_projectService.GetAllRequirementViewModelsFor(_projectid).First().KeyValue);
        }

        [TestMethod]
        public void ShouldUpdateProject()
        {
            var AllProjectsBeforeTest = _projectService.GetAllProjectAsItemViewModel();
            ProjectDefinitionFormViewModel editorVMDefinition = _projectService.GetProjectEditorViewModelFor(_projectid).Definition;
            var ProjectIdBeforeTest = editorVMDefinition.ProjectID;
            _projectService.CreateEditProjectDefinitionWith(ref editorVMDefinition, 1, _projectid);
            var AllProjectsAfterTest = _projectService.GetAllProjectAsItemViewModel();
            Assert.IsTrue(AllProjectsBeforeTest.Count() == AllProjectsAfterTest.Count() && editorVMDefinition.ProjectID == ProjectIdBeforeTest);
        }

        [TestMethod]
        public void ShouldUpdateRessource()
        {
            var AllRessourcesBeforeTest = _projectService.GetAllUseCaseViewModelsFor(_projectid);
            RessourceDefinitionViewModel editorVMDefinition = _projectService.GetUseCaseEditorViewModelFor(_useCaseid).Definition;
            var RessourceIdBeforeTest = editorVMDefinition.RessourceID;
            _projectService.CreateEditRessouceDefinitionWith(ref editorVMDefinition, 1, _projectid);
            var AllRessourcesAfterTest = _projectService.GetAllUseCaseViewModelsFor(_projectid);
            Assert.IsTrue(AllRessourcesBeforeTest.Count() == AllRessourcesAfterTest.Count() && editorVMDefinition.RessourceID == RessourceIdBeforeTest);
        }

        [TestMethod]
        public void ShouldUpdateRequirement()
        {
            var AllRequirementsBeforeTest = _projectService.GetAllRequirementViewModelsFor(_projectid);
            RequirementViewModel editorVMDefinition = _projectService.GetRequirementViewModelFor(_requirementid);
            var RequirementIdBeforeTest = editorVMDefinition.RequirementID;
            _projectService.CreateEditRessourceRequirementWith(ref editorVMDefinition, 1, _projectid);
            var AllRequirementsAfterTest = _projectService.GetAllRequirementViewModelsFor(_projectid);
            Assert.IsTrue(AllRequirementsBeforeTest.Count() == AllRequirementsAfterTest.Count() && editorVMDefinition.RequirementID == RequirementIdBeforeTest);
        }

        [TestMethod]
        public void ShouldUpdateConceptAssociation()
        {
            var AllAssociationsBeforeTest = _projectService.GetAllAssociationViewModelsFor(_projectid);
            RessourceAssociationViewModel  editorVMDefinition = AllAssociationsBeforeTest.First();
            var AssociationIdBeforeTest = editorVMDefinition.AssociationId;
            _projectService.CreateEditRessouceAssociationWith(ref editorVMDefinition, 1, _projectid);
            var AllAssociationsAfterTest = _projectService.GetAllAssociationViewModelsFor(_projectid);
            Assert.IsTrue(AllAssociationsBeforeTest.Count() == AllAssociationsAfterTest.Count() && editorVMDefinition.AssociationId == AssociationIdBeforeTest);
        }

        [TestMethod]
        public void ShouldUpdateVersion()
        {
            var AllVersionsBeforeTest = _projectService.GetAllVersionViewModelsFor(_projectid);
            VersionViewModel editorVMDefinition = AllVersionsBeforeTest.First();
            var VersionIdBeforeTest = editorVMDefinition.VersionID;
            _projectService.CreateEditProjectVersionsWith(ref editorVMDefinition, 1, _projectid);
            var AllVersionsAfterTest = _projectService.GetAllVersionViewModelsFor(_projectid);
            Assert.IsTrue(AllVersionsBeforeTest.Count() == AllVersionsAfterTest.Count() && editorVMDefinition.VersionID == VersionIdBeforeTest);
        }

    }
}
