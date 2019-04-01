using Iteration0.Business.Domain;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Services;
using Iteration0.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Iteration0.Data.Repositories
{
    public class RessourceRepository : IRessourceRepository
    {
        private DbSet<RessourceDefinition> _dbSetRessourceDefinition;
        private DbSet<RessourceAssociation> _dbSetRessourceAssociation;
        private DbSet<RessourceRequirement> _dbSetRequirement;
        //private DbSet<RequiremenContext> _dbSetRequirementContext;
        private DbSet<Event> _dbSetRessourceEvent;
        private IUnitOfWork _unitOfWork;
        public void ConfigureDependencies(IUnitOfWork unitOfWork)
        {
            _dbSetRessourceDefinition = unitOfWork.DatabaseContext.Set<RessourceDefinition>();
            _dbSetRessourceAssociation = unitOfWork.DatabaseContext.Set<RessourceAssociation>();
            _dbSetRequirement = unitOfWork.DatabaseContext.Set<RessourceRequirement>();
            //_dbSetRequirementContext = unitOfWork.DatabaseContext.Set<RequiremenContext>();
            _dbSetRessourceEvent = unitOfWork.DatabaseContext.Set<Event>();
            _unitOfWork = unitOfWork;
        }
        public void Add(Ressource item)
        {
            _dbSetRessourceDefinition.Add(item.Definition);
        }
        public void Add(RessourceAssociation item)
        {
            _dbSetRessourceAssociation.Add(item);
        }

        public void Add(RessourceRequirement item)
        {
            _dbSetRequirement.Add(item);
        }

        public Ressource Get(int id)
        {
            var def = _dbSetRessourceDefinition.Find(id);
            return new Ressource(def);
        }
        public RessourceDefinition GetDefinition(int id, EntityState state = EntityState.Detached)
        {
            var def = _dbSetRessourceDefinition.Find(id);
            _unitOfWork.DatabaseContext.Entry(def).State = state;
            return def;
        }
        
        public List<Ressource> GetAll()
        {
            var result = new List<Ressource>();
            //Multi Project Access Not Authorized ! 
            // Please Use Project Repository to gain access to these ressources
            return result;
        }

        public IQueryable<RessourceDefinition> SearchAllRessourcesWith(int projectId, String content)
        {
            return ( from m in _dbSetRessourceDefinition where m.Project.Id == projectId && ( m.Name.Contains(content) || m.Definition.Contains(content) ) select m );
        }
        public IQueryable<RessourceRequirement> SearchAllRequirementsWith(int projectId, String content)
        {
            return (from m in _dbSetRequirement where m.Project.Id == projectId && (m.Behavior.Contains(content) || m.Description.Contains(content)) select m);
        }

        public RessourceAssociation GetAssociation(int id)
        {
            return _dbSetRessourceAssociation.Where(c => c.Id == id).FirstOrDefault();
        }
        public List<RessourceAssociation> GetAllChildrenAggregations(int id)
        {
            return _dbSetRessourceAssociation.Where(c => c.Parent.Id == id && (c.AssociationEnumType == (short)AssociationEnumType.HasOne || c.AssociationEnumType == (short)AssociationEnumType.HasMany)).ToList();
        }
        public List<RessourceAssociation> GetAllParentAggregationsFor(int id)
        {
            return _dbSetRessourceAssociation.Where(c => c.Ressource.Id == id && (c.AssociationEnumType == (short)AssociationEnumType.HasOne || c.AssociationEnumType == (short)AssociationEnumType.HasMany)).ToList();
        }
        public RessourceRequirement GetRequirement(int id)
        {
            return _dbSetRequirement.Where(c => c.Id == id && c.IsEnabled == true).FirstOrDefault();
        }

        public void Update(RessourceDefinition item)
        {
            var original = _dbSetRessourceDefinition.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
        }

        public void Update(RessourceAssociation item)
        {
            var original = _dbSetRessourceAssociation.Find(item.Id);
            original.Ressource = item.Ressource;
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
        }

        public void Update(RessourceRequirement item)
        {
            var original = _dbSetRequirement.Find(item.Id);
            original.Variants.Clear();
            original.Variants = item.Variants;
            original.UseCase = item.UseCase;
            original.Concept = item.Concept;
            original.UI = item.UI;
            original.Infrastructure = item.Infrastructure;
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
        }
        public void Remove(RessourceAssociation item)
        {
            var original = _dbSetRessourceAssociation.Find(item.Id);
            _dbSetRessourceAssociation.Remove(original);
        }

        public static readonly short[] BehaviorRequirementsTypes = { (short)RequirementEnumType.Default, (short)RequirementEnumType.LogicAlternative, (short)RequirementEnumType.UIAlternative };
        
        public List<RessourceRequirement> GetAllBehaviorRequirementsForUI(int UIComponentId)
        {
            return _dbSetRequirement.Where(c => c.UI.Id == UIComponentId && BehaviorRequirementsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
        }
        public List<RessourceRequirement> GetAllBehaviorRequirementsForUC(int UseCaseId)
        {
            return _dbSetRequirement.Where(c => c.UseCase.Id == UseCaseId && BehaviorRequirementsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
        }
        public List<RessourceRequirement> GetAllBehaviorRequirementsForConcept(int UIConceptId)
        {
            return _dbSetRequirement.Where(c => c.Concept.Id == UIConceptId && BehaviorRequirementsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
        }

    }

}