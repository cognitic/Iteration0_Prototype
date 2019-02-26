using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Domain;
using System.Collections.Generic;
using System.Linq;
using System;
using Iteration0.Business.Services;

namespace Iteration0.Business.Domain
{
    //Domain Aggregate Root
    public class Project : AggregateBase
    {
        //Domain
        public ProjectDefinition Definition;
        public List<ProjectContextType> ContextTypes = new List<ProjectContextType>();
        public List<RessourceDefinition> RessourceDefinitions = new List<RessourceDefinition>();
        public List<ProjectProduct> Products = new List<ProjectProduct>();
        public List<RessourceRequirement> Requirements = new List<RessourceRequirement>();
        
        public List<RessourceDefinition> Concepts
        {
            get
            {
                return RessourceDefinitions.Where(x => x.RessourceEnumType ==  (int)RessourceEnumType.Domain).ToList();
            }
        }
        public List<RessourceDefinition> UseCases
        {
            get
            {
                return RessourceDefinitions.Where(x => x.RessourceEnumType == (int)RessourceEnumType.UseCase).ToList();
            }
        }
        public List<RessourceDefinition> UIComponents
        {
            get
            {
                return RessourceDefinitions.Where(x => x.RessourceEnumType == (int)RessourceEnumType.Component).ToList();
            }
        }

        public Project()
        {
            Definition = new ProjectDefinition();
            rootDefinition = Definition;
        }
        public Project(ProjectDefinition ExistingDefinition, List<RessourceRequirement> RessourcesRequirements)
        {
            Definition = ExistingDefinition;
            rootDefinition = Definition;
            if (!(ExistingDefinition.ContextTypes is null)) ContextTypes = ExistingDefinition.ContextTypes.ToList();
            if (!(ExistingDefinition.Products is null)) Products = ExistingDefinition.Products.ToList();
            if (!(ExistingDefinition.Ressources is null)) RessourceDefinitions = ExistingDefinition.Ressources.ToList();
            if (!(RessourcesRequirements is null)) Requirements = RessourcesRequirements;
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
        public void Change(IEntity entity, int updatedByUserId, bool MustLog = true)
        {
            entity.UpdatedBy = updatedByUserId; entity.UpdatedDate = DateTime.Now;
            //log 
        }
        public void ChangeAll(List<IEntity> entities, int updatedByUserId)
        {
            foreach (IEntity entity in entities)
            {
                Change(entity, updatedByUserId, false);
            }
            //log 
        }
        public void EndedBy(int UserId)
        {
            ChangedBy(UserId);
            //log 
        }

    }
}