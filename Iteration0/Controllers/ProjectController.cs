using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Iteration0.ViewModels;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Services;
using Iteration0.Data.Repositories;
using System.Web.Script.Serialization;

namespace Iteration0.Controllers
{
    public class ProjectController : Controller
    {
        private IProjectService _projectService;
        private IUserService _userService;
        //private ILogger _logger;

        public ProjectController(IProjectService projectService, IUserService userService, IProjectRepository projectRepository, IRessourceRepository ressourceRepository, IMappingService mapperService)
        {
            this._projectService = projectService;
            this._projectService.ConfigureDependencies(projectRepository, ressourceRepository, mapperService);
            this._userService = userService;
            //this._logger = logger;
            ViewBag.SelectorProjects = _projectService.GetAllProjectAsItemViewModel();
        }

        // GET: /Project/Index
        public ActionResult Index()
        {
            ViewBag.AllItems = _projectService.SummarizeAllProjects();
            return View();
        }
        // GET: /Project/Project/RessourceCategory
        public ActionResult RessourceCategory(String Name)
        {
            return View();
        }
        // GET: /Project/Project/RessourceEditor
        public ActionResult RessourceEditor(int RessourceID)
        {
            var def = _projectService.GetRessourceDefinitionFor(RessourceID);
            switch (def.RessourceEnumType)
            {
                case (short)RessourceEnumType.Domain:
                    return RedirectToAction("DomainConceptEditor", new { ConceptID = RessourceID });
                case (short)RessourceEnumType.UseCase:
                    return RedirectToAction("UseCaseEditor", new { FunctionID = RessourceID });
                case (short)RessourceEnumType.Component:
                    return RedirectToAction("UIComponentEditor", new { ComponentID = RessourceID });
                default:
                    return RedirectToAction("Project", "Search");
            }
        }
        // GET: /Project/ProjectEditor
        public ActionResult ProjectEditor(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            ProjectEditorViewModel editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
            //ViewBag.EditorTitle = editorVM.Definition.Title;
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(editorVM);
            return View();
        }
        // GET: /Project/DomainConcepts
        public ActionResult DomainConcepts(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            //ViewBag.AllItems = _projectService.SummarizeAllConceptsFor(ProjectID);
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(_projectService.GetDomainConceptsBoardEditorViewModelFor(ProjectID));
            return View();
        }      

        //[HttpGet]// GET: /Project/Scaffold
        //public FileResult Scaffold(int ProjectID)
        //{
        //    //GenerateScaffoldZIPFileFor
        //    //ViewBag.ProjectID = ProjectID;
        //    //using (ZipFile zip = new ZipFile())
        //    //{
        //    //    zip.AddDirectory(Server.MapPath("~/Directories/hello"));
        //    //    MemoryStream output = new MemoryStream();
        //    //    zip.Save(output);
        //    //    return File(output.ToArray(), "application/zip", "scaffold.zip");
        //    //}
        //    return File();
        //}

        // GET: /Project/DomainConceptEditor
        public ActionResult DomainConceptEditor(int ConceptID)
        {
            DomainConceptEditorViewModel editorVM = _projectService.GetDomainConceptEditorViewModelFor(ConceptID);
            ViewBag.ProjectID = editorVM.ProjectID;
            ViewBag.EditorTitle = editorVM.Definition.Name;
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(editorVM);
            return View();
        }
        // GET: /Project/UseCases
        public ActionResult UseCases(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            //ViewBag.AllItems = _projectService.SummarizeAllUseCasesFor(ProjectID);
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(_projectService.GetUseCasesBoardEditorViewModelFor(ProjectID)); 
            return View();
        }
        // GET: /Project/UseCaseEditor
        public ActionResult UseCaseEditor(int FunctionID)
        {
            UseCaseEditorViewModel editorVM = _projectService.GetUseCaseEditorViewModelFor(FunctionID);
            ViewBag.ProjectID = editorVM.ProjectID;
            ViewBag.EditorTitle = editorVM.Definition.Name;
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(editorVM);
            return View();
        }
        // GET: /Project/UIComponents
        public ActionResult UIComponents(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            //ViewBag.AllItems = _projectService.SummarizeAllUIComponentFor(ProjectID);
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(_projectService.GetUIComponentsBoardEditorViewModelFor(ProjectID));
            return View();
        }
        // GET: /Project/UIComponentEditor
        public ActionResult UIComponentEditor(int ComponentID)
        {
            UIComponentEditorViewModel editorVM = _projectService.GetUIComponentEditorViewModelFor(ComponentID);
            ViewBag.ProjectID = editorVM.ProjectID;
            ViewBag.EditorTitle = editorVM.Definition.Name;
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(editorVM);
            return View();
        }
        // GET: /Project/ProductLine
        public ActionResult ProductLine(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            ViewBag.AllItems = _projectService.GetProductViewModelsFor( ProjectID);
            var ProductItems = new List<ItemViewModel>();
            foreach (ProductViewModel prod in ViewBag.AllItems)
            {
                ProductItems.Add(new ItemViewModel() { KeyValue = prod.ProductID.ToString(), Label = prod.Name });
            }
            ViewBag.ProductItemsAsJson = new JavaScriptSerializer().Serialize(ProductItems);
            return View();
        }
        // GET: /Project/VersionEditor
        public ActionResult VersionEditor(int VersionID)
        {
            VersionEditorViewModel editorVM = _projectService.GetVersionEditorViewModelFor(VersionID);
            ViewBag.ProjectID = editorVM.ProjectID;
            ViewBag.EditorTitle = editorVM.Definition.NumberName;
            ViewBag.editorVMAsJson = new JavaScriptSerializer().Serialize(editorVM);
            return View();
        }
                // GET: /Project/Downloads
        public ActionResult Downloads(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            return View();
        }
        // GET: Project/Glossary
        public ActionResult Glossary(int ProjectID)
        {
            ViewBag.ProjectID = ProjectID;
            return View();
        }
        // GET: Project/Options
        public ActionResult Options()
        {
            return View();
        }
        // GET: Project/Search
        public ActionResult Search(int ProjectID, string Query)
        {
            ViewBag.ProjectID = ProjectID;
            ViewBag.EditorTitle = Query;
            ViewBag.SearchResults = _projectService.GetSearchResultViewModelsFor(ProjectID, Query);
            return View();
        }
        // GET: Project/About
        public ActionResult About()
        {
            return View();
        }


        // POST: /Project/RemoveProjectContextType
        [HttpPost]
        public JsonResult RemoveProjectContextType(int contextTypeID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveProjectContextTypeWith(contextTypeID, projectID, userId);
                var editorVM = _projectService.GetProjectEditorViewModelFor(projectID);
                return Json(editorVM);
            }
        }
        // POST: /Project/RemoveProjectContexts
        [HttpPost]
        public JsonResult RemoveProjectContexts(int contextID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveProjectContextWith(contextID, projectID, userId);
                var editorVM = _projectService.GetProjectEditorViewModelFor(projectID);
                return Json(editorVM);
            }
        }
        
        // POST: /Project/RemoveProjectVersion
        [HttpPost]
        public JsonResult RemoveProjectVersion(int versionID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveProjectVersionWith(versionID, projectID, userId);
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        // POST: /Project/RemoveVersionRequirement
        [HttpPost]
        public JsonResult RemoveVersionRequirement(int requirementID, int versionID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveVersionRequirementWith(requirementID, versionID, userId);
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }

        // POST: /Project/RemoveProjectProducts
        [HttpPost]
        public JsonResult RemoveProjectProduct(int productID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveProductWith(productID, projectID, userId);
                var editorVM = _projectService.GetProjectEditorViewModelFor(projectID);
                return Json(editorVM);
            }
        }
        // POST: /Project/RemoveRessourceDefinition
        [HttpPost]
        public JsonResult RemoveRessourceDefinition(int ressourceID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveRemoveRessourceDefinition(ressourceID, projectID, userId);
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        // POST: /Project/RemoveRessourceAssociation
        [HttpPost]
        public JsonResult RemoveRessourceAssociation(int associationID, int ressourceID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveRessourceAssociationWith(associationID, ressourceID, userId);
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        // POST: /Project/RemoveRessourceRequirement
        [HttpPost]
        public JsonResult RemoveRessourceRequirement(int requirementID, int projectID)
        {
            if (true)
            {
                int userId = 1;// Session["UserID"] as int;
                _projectService.RemoveRessourceRequirementWith(requirementID, projectID, userId);
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        // POST: /Project/SaveCustomThemeColors
        [HttpPost]
        public JsonResult SaveCustomThemeColors(String bgColor, String accentColor)
        {
            if (bgColor.Length == 7 && accentColor.Length == 7)
            {
                Session["CustomCSSRules"] = "body {  background-color: "+ bgColor + ";}" + "button, input[type=\'button\'], .pop_up_title {  background-color: " + accentColor + ";}";
            }
            return Json("OK", JsonRequestBehavior.AllowGet);
        }
        // POST: /Project/CreateEditProject
        [HttpPost]
        public JsonResult CreateEditProject(ProjectDefinitionFormViewModel formVM, int ProjectID)
        {
            createEditDelegate<ProjectDefinitionFormViewModel> editorDelegate = _projectService.CreateEditProjectDefinitionWith;
            string result = GetControllerStatusForDelegate<ProjectDefinitionFormViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(formVM.ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }
        // POST: /Project/CreateEditProjectContextTypes
        [HttpPost]
        public JsonResult CreateEditProjectContextTypes(ProjectContextTypeViewModel formVM, int ProjectID)
        {
            createEditDelegate<ProjectContextTypeViewModel> editorDelegate = _projectService.CreateEditProjectContextTypesWith;
            string result = GetControllerStatusForDelegate<ProjectContextTypeViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }
        // POST: /Project/CreateEditProjectContexts
        [HttpPost]
        public JsonResult CreateEditProjectContexts(ProjectContextViewModel formVM, int ProjectID)
        {
            createEditDelegate<ProjectContextViewModel> editorDelegate = _projectService.CreateEditProjectContextsWith;
            string result = GetControllerStatusForDelegate<ProjectContextViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }

        // POST: /Project/CreateEditVersionRequirementWith
        [HttpPost]
        public JsonResult CreateEditVersionRequirementWith(ItemViewModel formVM, int ProjectID)
        {
            createEditDelegate<ItemViewModel> editorDelegate = _projectService.CreateEditVersionRequirementWith;
            string result = GetControllerStatusForDelegate<ItemViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }

        // POST: /Project/CreateEditProjectProduct
        [HttpPost]
        public JsonResult CreateEditProjectProduct(ItemViewModel formVM, int ProjectID)
        {
            createEditDelegate<ItemViewModel> editorDelegate = _projectService.CreateEditProjectProductWith;
            string result = GetControllerStatusForDelegate<ItemViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }
        // POST: /Project/CreateEditProjectInfrastructure
        [HttpPost]
        public JsonResult CreateEditProjectInfrastructure(ItemViewModel formVM, int ProjectID)
        {
            int InfrastructureId = 0;
            if (formVM.KeyValue != null) int.Parse(formVM.KeyValue);
            RessourceDefinitionViewModel rsc = (InfrastructureId > 0) ? _projectService.GetRessourceDefinitionFor(InfrastructureId) : new RessourceDefinitionViewModel();
            rsc.Name = formVM.Label; rsc.Definition = formVM.Tooltip; rsc.RessourceEnumType = (short)RessourceEnumType.Infrastructure; rsc.ScaleOrder = 3; rsc.StepOrder = 3; rsc.SortOrder = 99;
            return CreateEditRessourceDefinition(rsc, ProjectID);
        }
        
        // POST: /Project/CreateEditProjectVersion
        [HttpPost]
        public JsonResult CreateEditProjectVersion(VersionViewModel formVM, int ProjectID)
        {
            createEditDelegate<VersionViewModel> editorDelegate = _projectService.CreateEditProjectVersionsWith;
            string result = GetControllerStatusForDelegate<VersionViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetProjectEditorViewModelFor(ProjectID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }

        // POST: /Project/CreateEditBoardItem
        [HttpPost]
        public JsonResult CreateEditBoardItem(BoardItemViewModel formVM, int ProjectID)
        {
            RessourceDefinitionViewModel rsc = (formVM.ItemID > 0) ? _projectService.GetRessourceDefinitionFor(formVM.ItemID) : new RessourceDefinitionViewModel();
            rsc.Name = formVM.Name; rsc.ProjectContextId = formVM.PoolID; rsc.RessourceEnumType = (short)formVM.ItemType; rsc.ScaleOrder = formVM.ScaleOrder; rsc.StepOrder = formVM.StepOrder; rsc.SortOrder = formVM.SortOrder;
            return CreateEditRessourceDefinition(rsc, ProjectID);
        }
        public JsonResult CreateEditRessourceDefinition(RessourceDefinitionViewModel rsc, int ProjectID)
            {createEditDelegate<RessourceDefinitionViewModel> editorDelegate = _projectService.CreateEditRessouceDefinitionWith;
            string result = GetControllerStatusForDelegate<RessourceDefinitionViewModel>(editorDelegate, ref rsc, ProjectID);
            if (result == "OK")
            {
                switch (rsc.RessourceEnumType)
                {
                    case (short)RessourceEnumType.Domain:
                        return Json(_projectService.GetDomainConceptsBoardEditorViewModelFor(ProjectID));
                    case (short)RessourceEnumType.UseCase:
                        return Json(_projectService.GetUseCasesBoardEditorViewModelFor(ProjectID));
                    case (short)RessourceEnumType.Component:
                        return Json(_projectService.GetUIComponentsBoardEditorViewModelFor(ProjectID));
                    case (short)RessourceEnumType.Infrastructure:
                        return Json(_projectService.GetProjectEditorViewModelFor(ProjectID));
                    default:
                        return Json("Wrong Ressource Id !");
                }
            }
            else
            {
                return Json(result);
            }
        }
        // POST: /Project/CreateEditRessouceDefinition
        [HttpPost]
        public JsonResult CreateEditRessouceDefinition(RessourceDefinitionViewModel formVM, int ProjectID)
        {
            createEditDelegate<RessourceDefinitionViewModel> editorDelegate = _projectService.CreateEditRessouceDefinitionWith;
            string result = GetControllerStatusForDelegate<RessourceDefinitionViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetRessourceEditorViewModelFor(formVM.RessourceID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }
        // POST: /Project/CreateEditRessouceAssociation
        [HttpPost]
        public JsonResult CreateEditRessouceAssociation(RessourceAssociationViewModel formVM, int ProjectID)
        {
            createEditDelegate<RessourceAssociationViewModel> editorDelegate = _projectService.CreateEditRessouceAssociationWith;
            string result = GetControllerStatusForDelegate<RessourceAssociationViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                var editorVM = _projectService.GetRessourceEditorViewModelFor(formVM.ParentID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }

        // POST: /Project/CreateEditRessourceRequirement
        [HttpPost]
        public JsonResult CreateEditRessourceRequirement(RequirementViewModel formVM, int ProjectID)
        {
            createEditDelegate<RequirementViewModel> editorDelegate = _projectService.CreateEditRessourceRequirementWith;
            string result = GetControllerStatusForDelegate<RequirementViewModel>(editorDelegate, ref formVM, ProjectID);
            if (result == "OK")
            {
                //var editorVM = _projectService.GetRessourceEditorViewModelFor(formVM.RessourceID);
                var editorVM = _projectService.GetUseCaseEditorViewModelFor(formVM.UseCaseID);
                return Json(editorVM);
            }
            else
            {
                return Json(result);
            }
        }

        public delegate void createEditDelegate<T>(ref T viewModel, int userId, int projectId);
        public String GetControllerStatusForDelegate<T>(createEditDelegate<T> delegateCall,ref T delegateMessage, int projectId)
        {
            string result = "";
            int userId = 1;// Session["UserID"] as int;
            if (true)//user access
            {
                try
                {
                    if (true)//data access _projectService.Validate(delegateMessage))
                    {
                        createEditDelegate<T> handler = delegateCall;
                        handler(ref delegateMessage, userId, projectId);
                        return "OK";
                    }
                    else
                        return "Editor Validation Rule Error";
                }
                catch (Exception ex)
                {
                    return "Unexpected Error";
                    //AddLog("Warning", "Infotrack", "CreateEditInsertion", userid, ex.Message, ex.StackTrace);
                }
            }
            else
                return "No Authorisation Error";
        }



    }
}
