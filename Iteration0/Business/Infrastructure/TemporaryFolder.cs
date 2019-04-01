using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.Business.Infrastructure
{
    public class TemporaryFolder
    {
        public string RootPath { get; set; }

        public TemporaryFolder(String rootFolderPath)
        {
            this.RootPath = rootFolderPath;
        }
    }
}