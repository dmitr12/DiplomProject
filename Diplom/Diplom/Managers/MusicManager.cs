using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.UserModels;
using Diplom.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class MusicManager
    {
        private readonly DataBaseContext db;
        private readonly IConfiguration config;
        private readonly ICloudService cloudService;
        private readonly IOptions<DropBoxOptions> options;

        public MusicManager(DataBaseContext db, IConfiguration config, ICloudService cloudService, IOptions<DropBoxOptions> options)
        {
            this.db = db;
            this.config = config;
            this.cloudService = cloudService;
            this.options = options;
        }

        public async Task<List<MusicGenre>> GetMusicGenresList()
        {
            return await db.MusicGenres.ToListAsync();
        }

        public async Task<List<Music>> GetMusicsByUserId(int userId)
        {
            return await db.Musics.Where(m=>m.UserId == userId).ToListAsync();
        }

        public async Task<IActionResult> AddMusic(AddMusicModel model, int userId)
        {
            User user = await db.Users.FindAsync(userId);
            string dateTimeNow = $"{DateTime.Now.Day}.{DateTime.Now.Month}.{DateTime.Now.Year} {DateTime.Now.Hour}:{DateTime.Now.Minute}:{DateTime.Now.Second}";
            if (await db.Musics.Where(m => m.UserId == user.UserId && m.MusicName == model.MusicName).FirstOrDefaultAsync() != null)
                return new OkObjectResult(new { msg = $"У вас уже есть запись с названием {model.MusicName}" });
            string musicFileName = $"{user.Login}_{dateTimeNow}_" + model.MusicFile.FileName;
            string sharingLinkMusic = "";
            string sharingLinkImage = "";
            try
            {
                if (await cloudService.IfFileExists("", musicFileName))
                    return new OkObjectResult(new { msg = $"В вашем хранилище уже есть файл {model.MusicFile.FileName}" });
                if (model.MusicImageFile != null)
                {
                    if (await cloudService.IfFileExists("", $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName))
                        return new OkObjectResult(new { msg = $"В вашем хранилище уже есть файл {model.MusicImageFile.FileName}" });
                    sharingLinkImage = await cloudService.AddFile("", $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName, model.MusicImageFile.OpenReadStream());
                }
                sharingLinkMusic = await cloudService.AddFile("", musicFileName, model.MusicFile.OpenReadStream());
                db.Musics.Add(new Music
                {
                    MusicName = model.MusicName,
                    MusicFileName = musicFileName,
                    MusicUrl = sharingLinkMusic,
                    MusicImageName = model.MusicImageFile == null ? $"{options.Value.DefaultMusicImageFile}" : $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName,
                    MusicImageUrl = model.MusicImageFile == null ? $"{options.Value.DefaultMusicImageFileLink}" : sharingLinkImage,
                    UserId = user.UserId,
                    DateOfPublication = DateTime.Now.Date,
                    MusicGenreId = model.MusicGenreId
                });
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }
    }
}
