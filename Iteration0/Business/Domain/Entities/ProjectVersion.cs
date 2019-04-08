using Iteration0.Business.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class ProjectVersion : IEntity
    {
        public string NumberName { get; set; }
        public string NickName { get; set; }
        public string Summary { get; set; }
        public short VersionEnumType { get; set; }
        public short ReleasedMonth { get; set; }
        public int ReleasedYear { get; set; }
        public bool IsEnabled { get; set; } = true;

        public virtual ProjectProduct Product { get; set; }        
        public virtual ICollection<RessourceRequirement> Specifications { get; set; }
        //public virtual ICollection<VersionRequirement> Specifications { get; set; }
    }
}