using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class UseCaseEditorViewModel
    {
        public int ProjectID { get; set; }
        public RessourceDefinitionViewModel Definition { get; set; }
        public List<SpecificationViewModel> Scenarios { get; set; }
        public List<RessourceAssociationViewModel> UISteps { get; set; }
        public List<SpecificationViewModel> Specifications { get; set; }
        public List<ItemViewModel> RequirementOptions { get; set; }
        public List<SpecificationViewModel> Alternatives { get; set; }
        public List<ProjectContextTypeViewModel> VariationPoints { get; set; }
        public List<ItemViewModel> ProjectBusinessProcesses { get; set; }
        public List<ItemViewModel> ProjectConcepts { get; set; }
        public List<ItemViewModel> ProjectUIs { get; set; }
        public List<ItemViewModel> ProjectInfrastructures { get; set; }
    }
 
}