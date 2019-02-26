﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class UseCaseEditorViewModel
    {
        public int ProjectID { get; set; }
        public RessourceDefinitionViewModel Definition { get; set; }
        public List<RequirementViewModel> Scenarios { get; set; }
        public List<RessourceAssociationViewModel> UISteps { get; set; }
        public List<RequirementViewModel> Requirements { get; set; }
        public List<ProjectContextTypeViewModel> VariationPoints { get; set; }
        public List<ItemViewModel> ProjectBusinessProcesses { get; set; }
    }
 
}