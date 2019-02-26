﻿using Iteration0.Business.Domain.Entities;
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
        public UIComponentFacade(Ressource ressource)
        {
            this._ressource = ressource;
            this.Definition = ressource.Definition;
            this._screens = ressource.Requirements.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Screen).OrderBy(x => x.SortOrder).ToList();
            this._fields = ressource.Requirements.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Field).OrderBy(x => x.SortOrder).ToList();
            this._Requirements = ressource.Requirements.Where(x => x.IsEnabled == true && x.RequirementEnumType == (short)RequirementEnumType.Rule).OrderBy(x => x.SortOrder).ToList();
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
        private List<RessourceRequirement> _Requirements = new List<RessourceRequirement>();
        public List<RessourceRequirement> Requirements
        {
            get
            {
                return _Requirements;
            }
        }
    }
}