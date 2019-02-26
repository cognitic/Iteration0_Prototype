using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class ProjectSummaryViewModel
    {
        public int ProjectId { get; set; }
        public String Title { get; set; }
        public Int32 ConceptCount { get; set; }
        public Int32 FunctionCount { get; set; }
        public Int32 ComponentCount { get; set; }
    }
}