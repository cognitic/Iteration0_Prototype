using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class ProjectProduct : IEntity
    {
        public string Name { get; set; }
        public string Mission { get; set; }
        public bool IsEnabled { get; set; } = true;

        public virtual ProjectDefinition Project { get; set; }
        public virtual ICollection<ProjectVersion> Versions { get; set; }
    }
}