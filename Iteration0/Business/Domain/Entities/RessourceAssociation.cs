using Iteration0.Business.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Iteration0.Business.Domain.Entities
{
    public class RessourceAssociation : IEntity
    {
        //[Key, Column(Order = 0)]
        //public int Parent_Id { get; set; }
        //[Key, Column(Order = 1)]
        //public int Ressource_Id { get; set; }
        public short AssociationEnumType { get; set; }
        public String CustomName { get; set; }
        public int SortOrder { get; set; }

        public virtual RessourceDefinition Parent { get; set; }
        public virtual RessourceDefinition Ressource { get; set; }
    }
}