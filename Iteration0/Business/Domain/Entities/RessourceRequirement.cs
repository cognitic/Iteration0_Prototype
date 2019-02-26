using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;

namespace Iteration0.Business.Domain.Entities
{
    public class RessourceRequirement : IEntity
    {
        public short RequirementEnumType { get; set; }
        public int Priority { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Attribute1Value { get; set; }
        public string Attribute2Value { get; set; }
        public string Attribute3Value { get; set; }
        public string Attribute4Value { get; set; }
        public string Attribute5Value { get; set; }
        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; }
        public string WorkItemURL { get; set; }

        //public virtual RessourceDefinition Ressource { get; set; }
        public virtual RessourceDefinition Ressource { get; set; }
        public virtual ICollection<ProjectContext> Contexts { get; set; }
        public virtual ICollection<ProjectVersion> Versions { get; set; }
        //public virtual ICollection<RequiremenContext> Contexts { get; set; }
        //public virtual ICollection<VersionRequirement> Versions { get; set; }
    }
}