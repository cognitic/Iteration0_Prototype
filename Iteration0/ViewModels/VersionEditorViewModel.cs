using System;
using System.Collections.Generic;
using System.Web;

namespace Iteration0.ViewModels
{
    public class AnalysisMatrixViewModel
    {
        public int ProjectID { get; set; }
        public List<SpecificationViewModel> DefaultSpecifications { get; set; }
        public List<ProductAlternativeViewModel> ProductAlternatives { get; set; }
        public List<ItemViewModel> ProjectProducts { get; set; }
        public List<ItemViewModel> ProjecVersions { get; set; }
        //public List<ProjectContextTypeViewModel> VariationPoints { get; set; }
    }
    public class ProductAlternativeViewModel
    {
        public List<int> ScopeIDs { get; set; } = new List<int>();
        public string ScopeSummary { get; set; } = "";
        public List<SpecificationViewModel> AlternativeSpecifications { get; set; } = new List<SpecificationViewModel>();
    }
    public class RequirementFunnel
    {
        public int RequiredUCPercent { get; set; } = 0;
        public int PlannedPercent { get; set; } = 0;
        public int CompletedPercent { get; set; } = 0;
        public int ReleasedPercent { get; set; } = 0;
    }
    public class ProductViewModel
    {
        public int ProductID { get; set; }
        public string Name { get; set; }
        public List<VersionViewModel> Versions { get; set; }
    }
    public class VersionEditorViewModel
    {
        public int ProjectID { get; set; }
        public VersionViewModel Definition { get; set; }
        public List<SpecificationViewModel> SelectedSpecifications { get; set; }
        public List<SpecificationViewModel> PendingProductSpecifications { get; set; }
        public List<ItemViewModel> ProjectProducts { get; set; }
        public List<ItemViewModel> ProductAlternatives { get; set; }
    }
    public class VersionViewModel
    {
        public int VersionID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string NumberName { get; set; }
        public string NickName { get; set; }
        public string Summary { get; set; }
        public short VersionEnumType { get; set; }
        public short ReleasedMonth { get; set; }
        public int ReleasedYear { get; set; }
        public bool IsInProgress { get; set; }
        public int CompletedAlternativeCount { get; set; }
        public int AlternativeCount { get; set; }
        public string ProgressName { get; set; }
        public string MonthName { get; set; }
    }
}
