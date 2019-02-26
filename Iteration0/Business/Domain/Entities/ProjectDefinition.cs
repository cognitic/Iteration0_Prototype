
using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class ProjectDefinition : IEntity
    {
        public string Title { get; set; }
        public string CodeName { get; set; }
        public string Brief { get; set; }
        public int OwnedBy { get; set; }
        public bool IsPrivateOnly { get; set; }
        public bool IsEnabled { get; set; } = true;

        public virtual ICollection<ProjectContextType> ContextTypes { get; set; }
        public virtual ICollection<ProjectContext> Contexts { get; set; }
        public virtual ICollection<ProjectProduct> Products { get; set; }
        public virtual ICollection<RessourceDefinition> Ressources { get; set; }
        public virtual ICollection<Event> Events { get; set; }
    }
}