using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using System.IO;
//using Ionic.Zip;
using System.Web.Mvc;

namespace Iteration0.Business.Services
{
    public class MockUpGeneratorService : IMockUpGeneratorService
    {
        //La variabilité des functions a été encapsulée via les patterns Strategy et Factory
        //Une interface destinée à l'injection d'un répository pour chaque Aggregate.
        //Un Service d'infrastructure en charge du datamapping des DTOs avec les attributs du domain
        //Un business service pour chaque aggregate qui a la responsabilité d'une collaboration avec de l'infrastructure
        public List<FileModel> GetScaffoldFileFor(int ProjectID)
        {
            List<FileModel> files = new List<FileModel>();
            //string[] filePaths = Directory.GetFiles(Server.MapPath("~/Files/"));
            //foreach (string filePath in filePaths)
            //{
            //    files.Add(new FileModel()
            //    {
            //        FileName = Path.GetFileName(filePath),
            //        FilePath = filePath
            //    });
            //}

            return files;
        }
        //public FileResult GenerateScaffoldZIPFileFor(List<RessourceDefinition> concepts)
        //{
        //    List<FileModel> files = new List<FileModel>();
        //    using (ZipFile zip = new ZipFile())
        //    {
        //        zip.AlternateEncodingUsage = ZipOption.AsNecessary;
        //        zip.AddDirectoryByName("Files");
        //        foreach (FileModel file in files)
        //        {
        //            if (file.IsSelected)
        //            {
        //                zip.AddFile(file.FilePath, "Files");
        //            }
        //        }
        //        string zipName = String.Format("Zip_{0}.zip", DateTime.Now.ToString("yyyy-MMM-dd-HHmmss"));
        //        using (MemoryStream memoryStream = new MemoryStream())
        //        {
        //            zip.Save(memoryStream);
        //            return File(memoryStream.ToArray(), "application/zip", zipName);
        //        }
        //    }
        //}


    }
    public class FileModel
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public bool IsSelected { get; set; }
    }
}