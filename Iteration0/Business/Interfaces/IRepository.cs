using System;
using System.Collections.Generic;
using Iteration0.Business.Domain;
using Iteration0.Business.Domain.Entities;
using System.Linq.Expressions;
using Iteration0.Data.Repositories;
using Iteration0.Business.Services;
using System.Linq;
using System.Data.Entity;

namespace Iteration0.Business.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        void ConfigureDependencies(IUnitOfWork unitOfWork);
        void Add(TEntity item);
        TEntity Get(int id);
        List<TEntity> GetAll();
        //bool Disable(int id, int userId);
    }
    public interface  IProjectRepository : IRepository<Project>
    {
        ProjectDefinition GetDefinition(int id);
        ProjectContextType GetContextType(int id);
        ProjectVersion GetVersion(int id);
        ProjectContext GetContext(int id);
        ProjectProduct GetProduct(int id);
        RessourceRequirement GetRequirement(int id);
        List<UseCaseFacade> GetAllUseCases(int id);
        List<DomainConceptFacade> GetAllDomainConcepts(int id);
        List<UIComponentFacade> GetAllUIComponents(int id);
        void Update(ProjectDefinition item);
        void Add(ProjectContextType item);
        void Update(ProjectContextType item);
        void Add(ProjectContext item);
        void Update(ProjectContext item);
        void Add(ProjectVersion item);
        void Update(ProjectVersion item);
        void Add(ProjectProduct item);
        void Update(ProjectProduct item);
        //int Add(Event item);
        List<ProjectContextType> GetAllVariationPointsFor(int id);
        List<ProjectContext> GetAllVariantsFor(int id, EntityState state = EntityState.Detached);
        List<ProjectProduct> GetAllProductsFor(int id);
        List<ProjectContext> GetAllDomainContexts(int id);
        List<ProjectContext> GetAllBusinessProcessesFor(int id);
        List<ProjectContext> GetAllFeaturesFor(int id);
        List<RessourceDefinition> GetAllInfrastructuresFor(int id);
        List<RessourceAssociation> GetAllAssociationsFor(int id);
        List<ProjectVersion> GetAllVersionFor(int id);
        List<RessourceDefinition> GetAllConceptDefinitionsFor(int id);
        List<RessourceDefinition> GetAllUseCaseDefinitionsFor(int id);
        List<RessourceDefinition> GetAllUIDefinitionsFor(int id);
        List<RessourceRequirement> GetAllBehaviorRequirementsFor(int id);
        List<RessourceRequirement> GetAllBehaviorRequirementsFor(int id, int productId, int versionId);
        //List<Event> GetAllEventsFor(int id);
        //List<Event> GetAllEventsFor(int id, EventEnumType filter);
    }
    public interface IRessourceRepository : IRepository<Ressource>
    {
        IQueryable<RessourceDefinition> SearchAllRessourcesWith(int projectId, String content);
        IQueryable<RessourceRequirement> SearchAllRequirementsWith(int projectId, String content);
        RessourceDefinition GetDefinition(int id, EntityState state = EntityState.Detached);
        RessourceAssociation GetAssociation(int id);
        RessourceRequirement GetRequirement(int id);
        List<RessourceAssociation> GetAllChildrenAggregations(int id);
        List<RessourceAssociation> GetAllParentAggregationsFor(int id);
        List<RessourceRequirement> GetAllBehaviorRequirementsForUI(int UIComponentId);
        List<RessourceRequirement> GetAllBehaviorRequirementsForUC(int UseCaseId);
        List<RessourceRequirement> GetAllBehaviorRequirementsForConcept(int UIConceptId);
        void Update(RessourceDefinition item);
        void Add(RessourceAssociation item);
        void Update(RessourceAssociation item);
        void Remove(RessourceAssociation item);
        void Add(RessourceRequirement item);
        void Update(RessourceRequirement item);
        //List<Event> GetAllEventsFor(int id, EventEnumType filter);
    }
}
