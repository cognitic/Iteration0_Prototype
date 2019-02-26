using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Identity
{
    public class User
    {
        public int  Id { get; protected set; }
        public string Login { get; protected set; }
        public bool CanEditRessources { get; protected set; }
        public bool CanEditRequirements { get; protected set; }
        public bool IsEnabled { get; protected set; } = true;
    }
}