using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class ProjectContextType : IEntity
    {
        public string Name { get; set; }
        public short ContextEnumType { get; set; }
        public short ScaleOrder { get; set; }
        public bool IsEnabled { get; set; } = true;

        public virtual ICollection<ProjectContext> Contexts { get; set; }
        public virtual ProjectDefinition Project { get; set; }
    }
}