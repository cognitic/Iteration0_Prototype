using System;
using System.Collections.Generic;
using System.Web;

namespace Iteration0.ViewModels
{
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
        public List<ItemViewModel> ProjectProducts { get; set; }
        public List<RequirementViewModel> ProductRequirements { get; set; }
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
