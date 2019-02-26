using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class ProjectEditorViewModel
    {
        public int DomainContextId { get; set; }
        public int BusinessProcessesId { get; set; }
        public int FeaturesId { get; set; }
        public ProjectDefinitionFormViewModel Definition { get; set; }
        public List<ProjectContextTypeViewModel> VariationPoints { get; set; }
        public List<ProjectContextViewModel> DomainContexts { get; set; }
        public List<ProjectContextViewModel> BusinessProcesses { get; set; }
        public List<ProjectContextViewModel> Features { get; set; }
        public List<ItemViewModel> Products { get; set; }
    }
    public class ProjectDefinitionFormViewModel 
    {
        public int ProjectID { get; set; }
        public string Title { get; set; }
        public string CodeName { get; set; }
        public string Brief { get; set; }
        public bool IsPrivateOnly { get; set; }
    }
    public class ProjectContextTypeViewModel
    {
        public int ProjectID { get; set; }
        public int ContextTypeID { get; set; }
        public short ContextEnumType { get; set; }
        public string Name { get; set; }
        public int ScaleOrder { get; set; }
        public List<ProjectContextViewModel> Contexts { get; set; }
    }
    public class ProjectContextViewModel
    {
        public int ContextID { get; set; }
        public int ContextTypeID { get; set; }
        public string Name { get; set; }
        public string CodeName { get; set; }
        public string Comment { get; set; }
        public short SortOrder { get; set; }
    }
}