using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain
{
    public class UIComponentFacade
    {
        public RessourceDefinition Definition { get; set; }

        private Ressource _ressource;
        public UIComponentFacade(Ressource ressource, List<RessourceRequirement> Specifications)
        {
            this._ressource = ressource;
            this.Definition = ressource.Definition;
            //this._screens = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Screen).OrderBy(x => x.SortOrder).ToList();
            //this._fields = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Field).OrderBy(x => x.SortOrder).ToList();
            this._Specifications = Specifications.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Default).OrderBy(x => x.SortOrder).ToList();
            this._Alternatives = Specifications.Where(x => x.IsEnabled == true && x.IsAlternative == true).OrderBy(x => x.SortOrder).ToList();
        }
        
        private List<RessourceRequirement> _screens;
        public List<RessourceRequirement> Screens
        {
            get
            {
                return _screens;
            }
        }
        private List<RessourceRequirement> _fields;
        public List<RessourceRequirement> Fields
        {
            get
            {
                return _fields;
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