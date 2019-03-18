using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class SearchResultViewModel
    {
        public int RessourceId { get; set; }
        public String RessourceName { get; set; }
        public int RequirementId { get; set; }
        public bool HasSearchResultInDefinition { get; set; }
        public String DefinitionExtract { get; set; } = "";
        public bool HasSearchResultInRequirement { get; set; }
        public String RequirementExtract { get; set; } = "";
    }
}