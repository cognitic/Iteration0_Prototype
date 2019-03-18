using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;

namespace Iteration0.Business.Domain.Entities
{
    public class RessourceRequirement : IEntity
    {
        public short RequirementEnumType { get; set; }
        public string Behavior { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public string ExternalCode { get; set; }
        public string ExternalURL { get; set; }
        public string FieldValue1 { get; set; }
        public string FieldValue2 { get; set; }
        public string FieldValue3 { get; set; }
        public string FieldValue4 { get; set; }
        public string FieldValue5 { get; set; }
        public bool IsAlternative { get { return (RequirementEnumType == (short)Services.RequirementEnumType.LogicAlternative || RequirementEnumType == (short)Services.RequirementEnumType.UIAlternative); } }
        public bool IsEnabled { get; set; } = true;
        public int SortOrder { get; set; }

        public virtual ProjectDefinition Project { get; set; }
        public virtual RessourceDefinition UseCase { get; set; }
        public virtual RessourceDefinition Concept { get; set; }
        public virtual RessourceDefinition UI { get; set; }
        public virtual RessourceDefinition Infrastructure { get; set; }
        public virtual ICollection<ProjectContext> Variants { get; set; }
        public virtual ICollection<ProjectVersion> Versions { get; set; }
        public virtual ICollection<RessourceRequirement> Alternatives { get; set; }
        public virtual RessourceRequirement DefaultBehavior { get; set; }
    }
}