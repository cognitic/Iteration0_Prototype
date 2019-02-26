using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class ItemViewModel
    {
        public String ParentKeyValue { get; set; }
        public String KeyValue { get; set; }
        public String Code { get; set; }
        public String Label { get; set; }
        public String Tooltip { get; set; }
        public int SortOrder { get; set; }
    }
}