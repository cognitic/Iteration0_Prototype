﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using Iteration0.Business.Domain;
using Iteration0.Business.Interfaces;
using Iteration0.Business.Domain.Entities;

using Iteration0.Data;
using System.Data.Entity;
using Iteration0.Business.Services;

namespace Iteration0.Data.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private  DbSet<ProjectDefinition> _dbSetProjectDefinition;
        private  DbSet<ProjectContext> _dbSetProjectContext;
        private  DbSet<ProjectContextType> _dbSetProjectContextType;
        private DbSet<RessourceDefinition> _dbSetProjectRessourceDefinition;
        private DbSet<RessourceAssociation> _dbSetProjectRessourceAssociation;
        private DbSet<RessourceRequirement> _dbSetRequirement;
        private DbSet<Event> _dbSetProjectEvent;
        private DbSet<ProjectVersion> _dbSetProjectVersion;
        private DbSet<ProjectProduct> _dbSetProjectProduct;
        private IUnitOfWork _unitOfWork;
        public void ConfigureDependencies(IUnitOfWork unitOfWork)
        {
            _dbSetProjectDefinition = unitOfWork.DatabaseContext.Set<ProjectDefinition>();
            _dbSetProjectContext = unitOfWork.DatabaseContext.Set<ProjectContext>();
            _dbSetProjectContextType = unitOfWork.DatabaseContext.Set<ProjectContextType>();
            _dbSetProjectRessourceDefinition = unitOfWork.DatabaseContext.Set<RessourceDefinition>();
            _dbSetProjectRessourceAssociation = unitOfWork.DatabaseContext.Set<RessourceAssociation>();
            _dbSetRequirement = unitOfWork.DatabaseContext.Set<RessourceRequirement>();
            _dbSetProjectEvent = unitOfWork.DatabaseContext.Set<Event>();
            _dbSetProjectVersion = unitOfWork.DatabaseContext.Set<ProjectVersion>();
            _dbSetProjectProduct = unitOfWork.DatabaseContext.Set<ProjectProduct>();
            _unitOfWork = unitOfWork;
        }

        public void Add(Project item)
        {
            _dbSetProjectDefinition.Add(item.Definition);
        }
        
        public Project Get(int id)
        {
            var def = _dbSetProjectDefinition.Find(id);
            return new Project(def, GetAllSpecificationsFor(id));
        }
        public ProjectDefinition GetDefinition(int id)
        {
            return _dbSetProjectDefinition.Find(id);
        }
        public List<Project> GetAll()
        {
            var result = new List<Project>();
            foreach (ProjectDefinition def in _dbSetProjectDefinition.ToList())
            {
                result.Add(new Project(def, null));
            }
            return result;
        }

        public void Update(ProjectDefinition item)
        {
            var original = _dbSetProjectDefinition.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
        }

        public void Add(ProjectContextType item)
        {
            _dbSetProjectContextType.Add(item);
        }

        //public int Add(Event item)
        //{
        //    _dbSetProjectEvent.Add(item);
        //    return true;
        //}

        public void Update(ProjectContextType item)
        {
            var original = _dbSetProjectContextType.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
            //_unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
            //_dbSetProjectContextType.Attach(item);
        }
        
        public void Update(ProjectContext item)
        {
            var original = _dbSetProjectContext.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
            //_unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
            //_dbSetProjectContext.Attach(item);
        }

        //StructureEnumType.Domain
        public List<DomainConceptFacade> GetAllDomainConcepts(int id)
        {
            var result = new List<DomainConceptFacade>();
            var Aggregations = new List<RessourceAssociation>();
            var Specifications = new List<RessourceRequirement>();
            foreach (RessourceDefinition def in GetAllConceptDefinitionsFor(id))
            {
                result.Add(new DomainConceptFacade(new Ressource(def), Aggregations, Aggregations, Specifications));
            }
            return result;
        }

        public List<UseCaseFacade> GetAllUseCases(int id)
        {
            var result = new List<UseCaseFacade>();
            var Specifications = new List<RessourceRequirement>();
            foreach (RessourceDefinition def in GetAllUseCaseDefinitionsFor(id))
            {
                result.Add(new UseCaseFacade(new Ressource(def), Specifications));
            }
            return result;
        }
        
        public List<UIComponentFacade> GetAllUIComponents(int id)
        {
            var result = new List<UIComponentFacade>();
            var Specifications = new List<RessourceRequirement>();
            foreach (RessourceDefinition def in _dbSetProjectRessourceDefinition.Where(c => c.Project.Id == id && c.RessourceEnumType == (short)RessourceEnumType.Component && c.IsEnabled == true).ToList())
            {
                result.Add(new UIComponentFacade(new Ressource(def), Specifications));
            }
            return result;
        }

        //public List<ProjectContextType> GetAllContextTypesFor(int id)
        //{
        //    return _dbSetProjectContextType.Where(c => c.Project.Id == id && c.IsEnabled == true).ToList();
        //}

        //public List<ProjectContext> GetAllContextsFor(int id)
        //{
        //    return _dbSetProjectContext.Where(c => c.Project.Id == id && c.IsEnabled == true).ToList();
        //}

        public List<ProjectContextType> GetAllVariationPointsFor(int id)
        {
            return _dbSetProjectContextType.Where(c => (c.Project.Id == id) && c.IsEnabled == true && c.ContextEnumType == (short)ContextEnumType.VariationPoint).OrderBy(p => p.ScaleOrder).ToList();
        }

        public List<ProjectContext> GetAllVariantsFor(int id, EntityState state = EntityState.Detached)
        {
            var result = _dbSetProjectContext.Where(c => c.Project.Id == id && c.IsEnabled == true && c.Type.ContextEnumType == (short)ContextEnumType.VariationPoint).ToList();
            foreach (var variant in result) { _unitOfWork.DatabaseContext.Entry(variant).State = state; }
            return result;
        }

        public List<ProjectContext> GetAllDomainContexts(int id)
        {
            return _dbSetProjectContext.Where(c => c.Project.Id == id && c.IsEnabled == true && c.Type.ContextEnumType == (short)ContextEnumType.DomainContext).ToList();
        }

        public List<ProjectContext> GetAllBusinessProcessesFor(int id)
        {
            return _dbSetProjectContext.Where(c => c.Project.Id == id && c.IsEnabled == true && c.Type.ContextEnumType == (short)ContextEnumType.BusinessProcess).ToList();
        }

        public List<ProjectContext> GetAllFeaturesFor(int id)
        {
            return _dbSetProjectContext.Where(c => c.Project.Id == id && c.IsEnabled == true && c.Type.ContextEnumType == (short)ContextEnumType.Feature).ToList();
        }

        public List<ProjectProduct> GetAllProductsFor(int id)
        {
            return _dbSetProjectProduct.Where(c => c.Project.Id == id && c.IsEnabled == true).ToList();
        }

        public List<RessourceDefinition> GetAllInfrastructuresFor(int id)
        {
            return _dbSetProjectRessourceDefinition.Where(c => c.Project.Id == id && c.RessourceEnumType == (short)RessourceEnumType.Infrastructure && c.IsEnabled == true).ToList();
        }
        public List<RessourceRequirement> GetAllSpecificationsBy(int id)
        {
            throw new NotImplementedException();
        }
        public List<RessourceAssociation> GetAllAssociationsFor(int id)
        {
            return _dbSetProjectRessourceAssociation.Where(c => c.Ressource.Project.Id == id).ToList();
        }
        
        public List<ProjectVersion> GetAllVersionFor(int id)
        {
            return _dbSetProjectVersion.Where(c => c.Product.Project.Id == id && c.IsEnabled == true).ToList();
        }

        public List<RessourceDefinition> GetAllConceptDefinitionsFor(int id)
        {
            return _dbSetProjectRessourceDefinition.Where(c => c.Project.Id == id && c.RessourceEnumType == (short)RessourceEnumType.Domain && c.IsEnabled == true).OrderBy(x => x.Name).ToList();
        }

        public List<RessourceDefinition> GetAllUseCaseDefinitionsFor(int id)
        {
            return _dbSetProjectRessourceDefinition.Where(c => c.Project.Id == id && c.RessourceEnumType == (short)RessourceEnumType.UseCase && c.IsEnabled == true).OrderBy(x => x.Name).ToList();
        }
        public List<RessourceDefinition> GetAllUIDefinitionsFor(int id)
        {
            return _dbSetProjectRessourceDefinition.Where(c => c.Project.Id == id && c.RessourceEnumType == (short)RessourceEnumType.Component && c.IsEnabled == true).OrderBy(x => x.Name).ToList();
        }

        public List<RessourceRequirement> GetAllSpecificationsFor(int id)
        {
            return _dbSetRequirement.Where(c => c.Project.Id == id && RessourceRepository.SpecificationsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
        }
        public List<RessourceRequirement> GetAllSpecificationsFor(int id, int productId, int versionId)
        {
            if (versionId > 0)
            {
                var version = _dbSetProjectVersion.Find(versionId);
                if (version.Specifications == null)
                {
                    return new List<RessourceRequirement>();
                }
                else
                {
                    return version.Specifications.Where(c => RessourceRepository.SpecificationsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
                }
            }
            else
            {
                return _dbSetRequirement.Where(c => c.Project.Id == id && c.Versions.Count == 0 && RessourceRepository.SpecificationsTypes.Contains(c.RequirementEnumType) && c.IsEnabled == true).ToList();
            }
        }
        public ProjectContextType GetContextType(int id)
        {
            return _dbSetProjectContextType.Where(c => c.Id == id && c.IsEnabled == true).FirstOrDefault();
        }

        public ProjectVersion GetVersion(int id)
        {
            return _dbSetProjectVersion.Where(c => c.Id == id && c.IsEnabled == true).FirstOrDefault();
        }

        public RessourceRequirement GetRequirement(int id)
        {
            return _dbSetRequirement.Where(c => c.Id == id  && c.IsEnabled == true).FirstOrDefault();
        }

        public void Add(ProjectContext item)
        {
            _dbSetProjectContext.Add(item);
        }

        public void Add(ProjectVersion item)
        {
            _dbSetProjectVersion.Add(item);
        }

        public void Update(ProjectVersion item)
        {
            var original = _dbSetProjectVersion.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
        }

        public ProjectContext GetContext(int id)
        {
            return _dbSetProjectContext.Where(c => c.Id == id && c.IsEnabled == true).FirstOrDefault();
        }

        public ProjectProduct GetProduct(int id)
        {
            return _dbSetProjectProduct.Where(c => c.Id == id && c.IsEnabled == true).FirstOrDefault();
        }

        public void Add(ProjectProduct item)
        {
            _dbSetProjectProduct.Add(item);
        }

        public void Update(ProjectProduct item)
        {
            var original = _dbSetProjectProduct.Find(item.Id);
            _unitOfWork.DatabaseContext.Entry(original).CurrentValues.SetValues(item);
            //_unitOfWork.DatabaseContext.Entry(item).State = EntityState.Modified;
            //_dbSetProjectProduct.Attach(item);
        }

    }
}