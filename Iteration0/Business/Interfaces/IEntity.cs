using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace Iteration0.Business.Interfaces
{
    public class IEntity
    {
        [Key]
        public int  Id { get; protected set; }
        public DateTime UpdatedDate { get; set; }
        public int UpdatedBy { get; set; }
    }
}