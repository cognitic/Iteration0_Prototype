using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain
{
    public class UseCaseFacade
    {
        private Ressource _ressource;
        public RessourceDefinition Definition { get; set; }
        public UseCaseFacade(Ressource ressource, List<RessourceRequirement> Specifications)
        {
            this._ressource = ressource;
            this.Definition = ressource.Definition;
            //this._Scenarios = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Scenario).OrderBy(x => x.SortOrder).ToList();
            //this._UISteps = ressource.Associations.Where( x => x.AssociationEnumType == (short)AssociationEnumType.UISteps).OrderBy(x => x.SortOrder).ToList();
            this._Specifications = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Default).OrderBy(x => x.SortOrder).ToList();
            this._Alternatives = Specifications.Where(x => x.IsEnabled == true && x.IsAlternative == true).OrderBy(x => x.SortOrder).ToList();
        }
    
    private List<RessourceRequirement> _Scenarios = new List<RessourceRequirement>();
    public List<RessourceRequirement> Scenarios
    {
        get
        {
            return _Scenarios;
        }
        }
        private List<RessourceAssociation> _UISteps = new List<RessourceAssociation>();
        public List<RessourceAssociation> UISteps
        {
            get
            {
                return _UISteps;
            }
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