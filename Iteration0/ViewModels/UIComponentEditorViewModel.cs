﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class UIComponentEditorViewModel
    {
        public int ProjectID { get; set; }
        public RessourceDefinitionViewModel Definition { get; set; }
        public List<SpecificationViewModel> Screens { get; set; }
        public List<SpecificationViewModel> Fields { get; set; }
        public List<SpecificationViewModel> Specifications { get; set; }
        public List<SpecificationViewModel> Alternatives { get; set; }
        public List<ProjectContextTypeViewModel> VariationPoints { get; set; }
        public List<ItemViewModel> ProjectFeatures { get; set; }
    }
}