using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;

namespace Iteration0.Business.Domain.Entities
{
    public class RessourceDefinition : IEntity
    {
        public string Name { get; set; }
        public short RessourceEnumType { get; set; }    
        public string Definition { get; set; }
        public short ScaleOrder { get; set; }
        public short StepOrder { get; set; }
        public int SortOrder { get; set; }  
        public bool IsEnabled { get; set; } = true;      

        public virtual ProjectDefinition Project { get; set; }
        public virtual ProjectContext Context { get; set; }
        public virtual ICollection<RessourceAssociation> Associations { get; set; }
        public virtual ICollection<RessourceRequirement> Requirements { get; set; }
    }
}