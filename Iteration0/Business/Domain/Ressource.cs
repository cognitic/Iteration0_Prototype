using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Domain;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Iteration0.Business.Domain
{
    //Domain Aggregate Root
    public class Ressource : AggregateBase
    {
        //Domain
        public RessourceDefinition Definition;
        public List<RessourceAssociation> Associations = new List<RessourceAssociation>();
        //public List<RessourceDefinition> AssociatedRessources;
        public List<RessourceRequirement> Requirements = new List<RessourceRequirement>();
        //Events

        public Ressource()
        {
            Definition = new RessourceDefinition();
            rootDefinition = Definition;
        }
        public Ressource(RessourceDefinition ExistingDefinition)
        {
            Definition = ExistingDefinition;
            rootDefinition = Definition;
            if (!(Definition.Associations is null)) Associations = Definition.Associations.ToList();
            if (!(Definition.Requirements is null)) Requirements = Definition.Requirements.ToList();
        }
        public void StartedBy(int OwnerId)
        {
            ChangedBy(OwnerId);
            //log 
        }
        public void ChangedBy(int userId)
        {
            Definition.UpdatedBy = userId; Definition.UpdatedDate = DateTime.Now;
            //log 
        }
    }
}
