using Diplom.Interfaces;
using Diplom.Utils;
using Dropbox.Api;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Services
{
    public class CloudService : ICloudService
    {
        private DropboxClient dbx;

        public CloudService(IOptions<DropBoxOptions> options)
        {
            dbx = new DropboxClient(options.Value.DropBoxToken);
        }

        public async Task<string> AddFile(string parent, string fileName, Stream stream)
        {
            await dbx.Files.UploadAsync($"{parent}/{fileName}", Dropbox.Api.Files.WriteMode.Overwrite.Instance, body: stream);
            var url = dbx.Sharing.CreateSharedLinkWithSettingsAsync($"{parent}/{fileName}").Result;
            return url.Url.Remove(url.Url.Length - 1) + "1";
        }

        public async Task DeleteFile(string parent, string fileName)
        {
            if (await IfFileExists(parent, fileName))
                await dbx.Files.DeleteAsync($"{parent}/{fileName}");
        }

        public async Task<string> EditFile(string oldParent, string oldFileName, string newParent, string newFileName, Stream stream)
        {
            string newUrl = "";
            await DeleteFile(oldParent, oldFileName);
            newUrl = await AddFile(newParent, newFileName, stream);
            return newUrl;
        }

        public async Task<bool> IfFileExists(string parent, string fileName)
        {
            try
            {
                var list = await dbx.Files.ListFolderAsync(parent);
     
                if (list.Entries.Where(i => i.Name == fileName).FirstOrDefault() != null)
                    return true;
                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}
