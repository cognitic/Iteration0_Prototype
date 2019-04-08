using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class ProjectContext : IEntity
    {
        public string Name { get; set; }
        public string CodeName { get; set; }
        public string Comment { get; set; }
        public short SortOrder { get; set; }
        public bool IsEnabled { get; set; } = true;

        public virtual ProjectContextType Type { get; set; }
        public virtual ProjectDefinition Project { get; set; }
        public virtual ICollection<RessourceRequirement> Specifications { get; set; }
        public virtual ICollection<RessourceDefinition> Ressources { get; set; }
        //public virtual ICollection<RequiremenContext> Specifications { get; set; }
    }
}