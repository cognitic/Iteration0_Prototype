using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Domain.Entities
{
    public class Event
    {
        [Key, Column(Order = 0)]
        public int  Id { get; protected set; }
        //[Key, Column(Order = 1)]
        //public int Ressource_Id { get; set; }
        //[Key, Column(Order = 2)]
        //public int? Requirement_Id { get; set; }
        public short EventEnumType { get; set; }
        public DateTime ActionDate { get; set; }
        public int ActionBy { get; set; }
        public string ActionLog { get; set; }

        public virtual RessourceDefinition Ressource { get; set; }
        public virtual RessourceRequirement Requirement { get; set; } //NB: nullable
    }
}