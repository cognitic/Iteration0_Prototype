using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class RessourceDefinitionViewModel 
    {
        //public int ProjectID { get; set; }
        public int RessourceID { get; set; }
        public short RessourceEnumType { get; set; }
        public string Name { get; set; }
        public string Definition { get; set; }
        public string Description { get; set; }
        public short ScaleOrder { get; set; }
        public short StepOrder { get; set; }
        public int SortOrder { get; set; }
        public int ProjectContextId { get; set; }
        public string ProjectContextName { get; set; }
    }
    public class RessourceAssociationViewModel
    {
        public int AssociationId { get; set; }
        public short AssociationEnumType { get; set; }
        public int ParentID { get; set; }
        public string ParentName { get; set; }
        public int RessourceID { get; set; }
        //public string ParentName { get; set; }
        public string RessourceName { get; set; }
        public string CustomName { get; set; }
    }
}