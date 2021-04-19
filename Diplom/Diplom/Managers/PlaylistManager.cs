using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.PlaylistModels;
using Diplom.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class PlaylistManager
    {
        private readonly DataBaseContext db;
        private readonly ICloudService cloudService;
        private readonly IOptions<DropBoxOptions> options;

        public PlaylistManager(DataBaseContext db, ICloudService cloudService, IOptions<DropBoxOptions> options)
        {
            this.db = db;
            this.cloudService = cloudService;
            this.options = options;
        }

        public async Task<IActionResult> AddPlaylist(AddPlaylistModel model, int userId)
        {
            var dateTimeNow = DateTime.Now;
            var createDate = $"{dateTimeNow.Day}.{dateTimeNow.Month}.{dateTimeNow.Year} {dateTimeNow.Hour}:{dateTimeNow.Minute}:{dateTimeNow.Second}";
            var user = await db.Users.FindAsync(userId);
            if (user == null)
                return new NotFoundObjectResult(new { msg = "Пользователь не найден" });
            var sharingLinkImage = "";
            try
            {
                if (model.PlaylistImage != null)
                {
                    if (await cloudService.IfFileExists("", $"{user.Login}_playlist_{createDate}_" + model.PlaylistImage.FileName))
                        return new OkObjectResult(new { msg = $"В вашем хранилище уже есть файл {model.PlaylistImage.FileName}" });
                    sharingLinkImage = await cloudService.AddFile("", $"{user.Login}_playlist_{createDate}_" + model.PlaylistImage.FileName, model.PlaylistImage.OpenReadStream());
                }
                var playlist = new Playlist
                {
                    PlaylistName = model.PlaylistName,
                    PlaylistDescription = model.PlaylistDescription,
                    PlaylistImageFile = model.PlaylistImage == null ? $"{options.Value.DefaultPlaylistImageFile}" : $"{user.Login}_playlist_{createDate}_" + model.PlaylistImage.FileName,
                    PlaylistImageUrl = model.PlaylistImage == null ? $"{options.Value.DefaultPlaylistImageLink}" : sharingLinkImage,
                    UserId = user.UserId,
                    CreateDate = dateTimeNow
                };
                db.Playlists.Add(playlist);
                await db.SaveChangesAsync();
                return new OkObjectResult(new { id = playlist.PlaylistId });
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }
    }
}
