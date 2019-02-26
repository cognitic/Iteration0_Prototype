using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class RequirementViewModel
    {
        public int RequirementID { get; set; }
        public int RessourceID { get; set; }
        public int RessourceName { get; set; }
        public short RequirementEnumType { get; set; }
        public int Priority { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Attribute1Value { get; set; }
        public string Attribute2Value { get; set; }
        public string Attribute3Value { get; set; }
        public string Attribute4Value { get; set; }
        public string Attribute5Value { get; set; }
        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; }
        public string WorkItemURL { get; set; }
    }
}