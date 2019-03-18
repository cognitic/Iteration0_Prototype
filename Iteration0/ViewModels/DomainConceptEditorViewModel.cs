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
        public List<RessourceAssociationViewModel> HasOne { get; set; }
        public List<RessourceAssociationViewModel> HasMany { get; set; }
        public List<RessourceAssociationViewModel> PartOf { get; set; }
        public List<RessourceAssociationViewModel> PartsOf { get; set; }
        public List<RequirementViewModel> Requirements { get; set; }
        public List<RequirementViewModel> Alternatives { get; set; }
        public List<ItemViewModel> ProjectConcepts { get; set; }
        public List<ItemViewModel> ProjectDomainContexts { get; set; }
    }
}