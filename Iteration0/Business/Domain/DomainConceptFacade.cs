using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain
{
    public class DomainConceptFacade
    {
        public RessourceDefinition Definition { get; set; }

        private Ressource _ressource;
        public DomainConceptFacade(Ressource ressource, List<RessourceAssociation> childrenAggregations, List<RessourceAssociation> parentAggregations, List<RessourceRequirement> Specifications)
        {
            this._ressource = ressource;
            this.Definition = ressource.Definition;
            this._ChildrenAggregations = childrenAggregations;
            this._ParentAggregations = parentAggregations;
            this._Specifications = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Default).OrderBy(x => x.SortOrder).ToList();
            this._Alternatives = Specifications.Where(x => x.IsEnabled == true && x.IsAlternative == true).OrderBy(x => x.SortOrder).ToList();
        }
        private List<RessourceAssociation> _ChildrenAggregations;
        public List<RessourceAssociation> GetChildrenAggregatedAs(AssociationEnumType aggregationEnum) 
        {
                return _ChildrenAggregations.Where(x => x.AssociationEnumType == (short)aggregationEnum).OrderBy(x => x.SortOrder).ToList();
        }
        private List<RessourceAssociation> _ParentAggregations;
        public List<RessourceAssociation> GetParentAggregatedAs(AssociationEnumType aggregationEnum)
        {
            return _ParentAggregations.Where(x => x.AssociationEnumType == (short)aggregationEnum).OrderBy(x => x.SortOrder).ToList();
        }
        private List<RessourceRequirement> _Specifications = new List<RessourceRequirement>();
        public List<RessourceRequirement> Specifications
        {
            get
            {
                return _Specifications;
            }
        }
        private List<RessourceRequirement> _Alternatives = new List<RessourceRequirement>();
        public List<RessourceRequirement> Alternatives
        {
            get
            {
                return _Alternatives;
            }
        }
    }
}