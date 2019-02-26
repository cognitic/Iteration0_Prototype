using Iteration0.Business.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class BoardEditorViewModel
    {
        public int ProjectID { get; set; }
        public RessourceEnumType ItemType { get; set; }
        public List<BoardPoolViewModel> Pools { get; set; }
        public List<ItemViewModel> ProjectPools { get; set; }
    }
    public class BoardPoolViewModel
    {
        //public int PoolID { get; set; }
        public string PoolName { get; set; }
        public List<BoardPoolStepViewModel> Steps { get; set; }
    }
    public class BoardPoolStepViewModel
    {
        public List<BoardItemViewModel> Scale1Items { get; set; }
        public List<BoardItemViewModel> Scale2Items { get; set; }
    }
    public class BoardItemViewModel
    {
        public int ItemID { get; set; }
        public int PoolID { get; set; }
        public string Name { get; set; }
        public int ItemType { get; set; }
        public short ScaleOrder { get; set; }
        public short StepOrder { get; set; }
        public int SortOrder { get; set; }
    }
}