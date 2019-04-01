using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Iteration0.ViewModels
{
    public class DocumentViewModel
    {
        public String Title { get; set; }
        public String SubTitle { get; set; }
        public String FileName { get; set; }
        public List<DocSectionViewModel> Content { get; set; }

        public DocumentViewModel(String documentTitle, String documentSubTitle, List<DocSectionViewModel> documentContent, String documentFileName)
        {
            Title = documentTitle; SubTitle = documentSubTitle; Content = documentContent; FileName = documentFileName;
        }
    }
    public class DocSectionViewModel
    {
        public String Header1 { get; set; }
        public String Header2 { get; set; }
        public String Header3 { get; set; }
        public String Content { get; set; }
        public int PageNumber { get; set; }

        public DocSectionViewModel(String sectionHeader1, String sectionHeader2, String sectionHeader3, String sectionContent)
        {
             Header1 = sectionHeader1; Header2 = sectionHeader2; Header3 = sectionHeader3; Content = sectionContent;
        }
    }

}