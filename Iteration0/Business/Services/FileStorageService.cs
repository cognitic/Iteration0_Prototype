using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Iteration0.Business.Domain.Entities;
using Iteration0.Business.Interfaces;
using System.IO;
using System.IO.Compression;
using Iteration0.Business.Infrastructure;

namespace Iteration0.Business.Services
{
    public class FileStorageService : IFileStorageService
    {

        public string RootPath { get; set; }
        public string StoragePath { get; set; }
        public string TemporaryStoragePath { get; set; }
        public void ConfigurePathsWith(String rootPath)
        {
            RootPath = rootPath;
            StoragePath = rootPath + "Storage\\";
            if (!Directory.Exists(StoragePath)) Directory.CreateDirectory(StoragePath);
            TemporaryStoragePath = StoragePath + "tmp\\";
            if (!Directory.Exists(TemporaryStoragePath)) Directory.CreateDirectory(TemporaryStoragePath);
        }

        public TemporaryFolder GetTemporaryFolderFor(String archiveTemplatePath)
        {
            string sourceFolderPath = RootPath + archiveTemplatePath;
            string temporaryFolderPath = TemporaryStoragePath + Guid.NewGuid().ToString();
            if (Directory.Exists(temporaryFolderPath)) Directory.Delete(temporaryFolderPath);
            Directory.CreateDirectory(temporaryFolderPath);
            foreach (string dir in System.IO.Directory.GetDirectories(sourceFolderPath, "*", System.IO.SearchOption.AllDirectories))
            {
                System.IO.Directory.CreateDirectory(System.IO.Path.Combine(temporaryFolderPath, dir.Substring(sourceFolderPath.Length)));
            }
            foreach (string file_name in System.IO.Directory.GetFiles(sourceFolderPath, "*", System.IO.SearchOption.AllDirectories))
            {
                System.IO.File.Copy(file_name, System.IO.Path.Combine(temporaryFolderPath, file_name.Substring(sourceFolderPath.Length)));
            }
            TemporaryFolder result = new TemporaryFolder(temporaryFolderPath);
            return result;
        }

        public string GetTemporaryZIPArchivePathFor(string archiveFolderPath)
        {
            string zipTemporaryPath = TemporaryStoragePath + Guid.NewGuid().ToString() + ".zip";
            if (System.IO.File.Exists(zipTemporaryPath)) System.IO.File.Delete(zipTemporaryPath);
            ZipFile.CreateFromDirectory(archiveFolderPath, zipTemporaryPath);
            return zipTemporaryPath;
        }

    }
}