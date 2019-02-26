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
        public DomainConceptFacade(Ressource ressource)
        {
            this._ressource = ressource;
            this.Definition = ressource.Definition;
            this._attributes = ressource.Associations.Where(x => x.AssociationEnumType == (short)AssociationEnumType.HasAttribute).OrderBy(x => x.SortOrder).ToList();
            this._hasOneAssociations = ressource.Associations.Where(x => x.AssociationEnumType == (short)AssociationEnumType.HasOne).OrderBy(x => x.SortOrder).ToList();
            this._hasManyAssociations = ressource.Associations.Where(x => x.AssociationEnumType == (short)AssociationEnumType.HasMany).OrderBy(x => x.SortOrder).ToList();
            this._operations = ressource.Associations.Where(x => x.AssociationEnumType == (short)AssociationEnumType.OperatesOn).OrderBy(x => x.SortOrder).ToList();
        }

        private List<RessourceAssociation> _attributes;
        public List<RessourceAssociation> Attributes
        {
            get
            {
                return _attributes;
            }
        }
        private List<RessourceAssociation> _hasOneAssociations;
        public List<RessourceAssociation> HasOneAssociations
        {
            get
            {
                return _hasOneAssociations;
            }
        }
        private List<RessourceAssociation> _hasManyAssociations;
        public List<RessourceAssociation> HasManyAssociations
        {
            get
            {
                return _hasManyAssociations;
            }
        }
        private List<RessourceAssociation> _operations;
        public List<RessourceAssociation> Operations
        {
            get
            {
                return _operations;
            }
        }
        
    }
}