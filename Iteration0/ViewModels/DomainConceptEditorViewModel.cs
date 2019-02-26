using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class DomainConceptEditorViewModel
    {
        public int ProjectID { get; set; }
        public RessourceDefinitionViewModel Definition { get; set; }
        public List<RessourceAssociationViewModel> Attributes { get; set; }
        public List<RessourceAssociationViewModel> HasOneAssociations { get; set; }
        public List<RessourceAssociationViewModel> HasManyAssociations { get; set; }
        public List<RessourceAssociationViewModel> Operations { get; set; }
        public List<ItemViewModel> ProjectConcepts { get; set; }
        public List<ItemViewModel> ProjectDomainContexts { get; set; }
    }
}