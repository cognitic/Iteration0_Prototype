using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class SpecificationViewModel
    {
        public int RequirementID { get; set; }
        public short RequirementEnumType { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public string FieldValue1 { get; set; }
        public string FieldValue2 { get; set; }
        public string FieldValue3 { get; set; }
        public string FieldValue4 { get; set; }
        public string FieldValue5 { get; set; }
        public int UseCaseID { get; set; }
        public string UseCase { get; set; }
        public int ConceptID { get; set; }
        public string Concept { get; set; }
        public int UIID { get; set; }
        public string UI { get; set; }
        public int InfrastructureID { get; set; }
        public string Infrastructure { get; set; }
        public int DefaultSpecificationID { get; set; }
        public string DefaultSpecification { get; set; }
        public List<int> ScopeIDs { get; set; } = new List<int>();
        public string ScopeSummary { get; set; } = "";
        public bool IsSelected { get; set; }
        public List<int> SelectedVersionIDs { get; set; } = new List<int>();
        public List<string> SelectedVersions { get; set; } = new List<string>();
        public List<int> SelectedProductIDs { get; set; } = new List<int>();
    }
}