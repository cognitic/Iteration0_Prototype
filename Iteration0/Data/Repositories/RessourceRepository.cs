using Iteration0.Business.Domain;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Services;
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
        public RessourceDefinition GetDefinition(int id)
        {
            var def = _dbSetRessourceDefinition.Find(id);
            _unitOfWork.DatabaseContext.Entry(def).State = EntityState.Detached;
            return def;
        }
        
        public List<Ressource> GetAll()
        {
            var result = new List<Ressource>();
            //Multi Project Access Not Authorized ! Please Use Project Repository to gain access to these ressources
            //foreach (RessourceDefinition def in _dbSetRessourceDefinition.ToList())
            //{
            //    result.Add(new Ressource(def));
            //}
            return result;
        }

        public RessourceAssociation GetAssociation(int id)
        {
            return _dbSetRessourceAssociation.Where(c => c.Id == id).FirstOrDefault();
        }

        public RessourceRequirement GetRequirement(int id)
        {
            return _dbSetRequirement.Where(c => c.Id == id && c.RequirementEnumType == (short)RequirementEnumType.Rule && c.IsEnabled == true).FirstOrDefault();
        }

        public void Update(RessourceDefinition item)
        {
            _unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
            _dbSetRessourceDefinition.Attach(item);
        }

        public void Update(RessourceAssociation item)
        {
            _dbSetRessourceAssociation.Attach(item);
            _unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
        }

        public void Update(RessourceRequirement item)
        {
            _dbSetRequirement.Attach(item);
            _unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
        }
        public void Remove(RessourceAssociation item)
        {
            _dbSetRessourceAssociation.Remove(item);
        }

    }

}