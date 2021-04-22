using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.PlaylistModels;
using Diplom.Models.PlaylistsMusicsModels;
using Diplom.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            var sharingLinkImage = "";
            try
            {
                var user = await db.Users.FindAsync(userId);
                if (user == null)
                    return new NotFoundObjectResult(new { msg = "Пользователь не найден" });
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

        public async Task<PlaylistInfo> GetPlaylistInfo(int playlistId)
        {
            return await db.Playlists.Where(p => p.PlaylistId == playlistId).Join(db.Users, p => p.UserId, u => u.UserId, (p, u) => new PlaylistInfo
            {
                PlaylistId = p.PlaylistId,
                PlaylistName = p.PlaylistName,
                PlaylistDescription = p.PlaylistDescription,
                PlaylistImageUrl = p.PlaylistImageUrl,
                UserId = p.UserId,
                UserLogin = u.Login,
                CreateDate = p.CreateDate
            }).FirstOrDefaultAsync();
        }

        public async Task<IActionResult> AddMusic(PlaylistsMusic model, int userId)
        {
            try
            {
                var user = await db.Users.FindAsync(userId);
                if (user == null)
                    return new NotFoundObjectResult(new { msg = "Пользователь не найден" });
                var playlist = await db.Users.FindAsync(model.PlaylistId);
                if(playlist == null)
                    return new NotFoundObjectResult(new { msg = "Указанный плейлист не существует" });
                if (playlist.UserId != userId)
                    return new ForbidResult();
                var music = await db.Musics.FindAsync(model.MusicId);
                if(music == null)
                    return new NotFoundObjectResult(new { msg = "Указанная музыкальная запись не существует" });
                db.PlaylistsMusics.Add(model);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<List<PlaylistInfo>> GetUserPlaylists(int userId)
        {
            return await db.Playlists.Where(p => p.UserId == userId).Select(p => new PlaylistInfo
            {
                PlaylistId = p.PlaylistId,
                PlaylistName = p.PlaylistName,
                PlaylistDescription = p.PlaylistDescription,
                PlaylistImageUrl = p.PlaylistImageUrl,
                UserId = p.UserId,
                CreateDate = p.CreateDate
            }).ToListAsync();
        }
    }
}
