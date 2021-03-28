using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.RatingModels;
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
        private readonly ICloudService cloudService;
        private readonly IOptions<DropBoxOptions> options;

        public MusicManager(DataBaseContext db, ICloudService cloudService, IOptions<DropBoxOptions> options)
        {
            this.db = db;
            this.cloudService = cloudService;
            this.options = options;
        }

        public async Task<List<MusicInfo>> GetFilteredList(string musicName, int genreId)
        {
            var filter = new{ MusicName = musicName == null ? "" : musicName, GenreId = genreId };
            string musicNameFilter = filter.MusicName.Length > 0 ? filter.MusicName : string.Empty;
            string musicGenreFilter = filter.GenreId > 0 ? filter.GenreId.ToString() : "%";
            List<MusicInfo> res = new List<MusicInfo>();
            res = await db.Musics.Where(m => EF.Functions.Like(m.MusicName, $"%{musicNameFilter}%")
               & EF.Functions.Like(m.MusicGenreId.ToString(), $"{musicGenreFilter}")).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
               {
                   Id = m.MusicId,
                   Name = m.MusicName,
                   MusicFileName = m.MusicFileName,
                   MusicUrl = m.MusicUrl,
                   MusicImageName = m.MusicImageName,
                   ImageUrl = m.MusicImageUrl,
                   GenreId = m.MusicGenreId,
                   UserId = u.UserId,
                   UserLogin = u.Login
               }).ToListAsync();
            return res;
        }

        public async Task<MusicInfo> GetMusic(int musicId, int currentUser)
        {
            double sumRating = 0;
            int? userRating = null;
            var rating = await db.MusicStarRatings.Where(r => r.MusicId == musicId).ToListAsync();
            if (rating.Exists(r => r.UserId == currentUser))
                userRating = rating.Find(r => r.UserId == currentUser).Rating;
            foreach (var entity in rating)
                sumRating += entity.Rating;
            var musicInfo = await db.Musics.Where(m=>m.MusicId == musicId).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
            {
                Id = m.MusicId,
                Name = m.MusicName,
                MusicFileName = m.MusicFileName,
                MusicUrl = m.MusicUrl,
                MusicImageName = m.MusicImageName,
                ImageUrl = m.MusicImageUrl,
                GenreId = m.MusicGenreId,
                UserId = u.UserId,
                UserLogin = u.Login,
                DateOfPublication = m.DateOfPublication,
                CountRatings = rating.Count,
                CurrentUserRating = userRating
            }).FirstOrDefaultAsync();
            musicInfo.GenreName = db.MusicGenres.Find(musicInfo.GenreId).GenreName;
            if (sumRating == 0)
                musicInfo.Rating = sumRating;
            else
                musicInfo.Rating = Math.Round(sumRating / rating.Count, 1);
            return musicInfo;
        }

        public async Task<List<MusicGenre>> GetMusicGenresList()
        {
            return await db.MusicGenres.OrderBy(g=>g.GenreName).ToListAsync();
        }

        public async Task<List<MusicInfo>> GetMusicsByUserId(int userId)
        {
            return await db.Musics.Where(m => m.UserId == userId).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
               {
                   Id = m.MusicId,
                   Name = m.MusicName,
                   MusicFileName = m.MusicFileName,
                   MusicUrl = m.MusicUrl,
                   MusicImageName = m.MusicImageName,
                   ImageUrl = m.MusicImageUrl,
                   GenreId = m.MusicGenreId,
                   UserId = u.UserId,
                   UserLogin = u.Login
               }).ToListAsync();
        }

        public async Task<List<MusicInfo>> GetPartOfMusicsByUserId(int userId, int count, int lastIndex)
        {
            return await db.Musics.Where(m => m.UserId == userId && m.MusicId > lastIndex).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
            {
                Id = m.MusicId,
                Name = m.MusicName,
                MusicFileName = m.MusicFileName,
                MusicUrl = m.MusicUrl,
                MusicImageName = m.MusicImageName,
                ImageUrl = m.MusicImageUrl,
                GenreId = m.MusicGenreId,
                UserId = u.UserId,
                UserLogin = u.Login,
            }).Take(count).ToListAsync();
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
                var music = new Music
                {
                    MusicName = model.MusicName,
                    MusicFileName = musicFileName,
                    MusicUrl = sharingLinkMusic,
                    MusicImageName = model.MusicImageFile == null ? $"{options.Value.DefaultMusicImageFile}" : $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName,
                    MusicImageUrl = model.MusicImageFile == null ? $"{options.Value.DefaultMusicImageFileLink}" : sharingLinkImage,
                    UserId = user.UserId,
                    DateOfPublication = DateTime.Now.Date,
                    MusicGenreId = model.MusicGenreId
                };
                db.Musics.Add(music);
                await db.SaveChangesAsync();
                return new OkObjectResult(new {id = music.MusicId});
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<IActionResult> EditMusic(EditMusicModel model, int UserId)
        {
            string musicFileName, imageFileName;
            User user = await db.Users.FindAsync(UserId);
            Music music = await db.Musics.FindAsync(model.Id);
            string dateTimeNow = $"{DateTime.Now.Day}.{DateTime.Now.Month}.{DateTime.Now.Year} {DateTime.Now.Hour}:{DateTime.Now.Minute}:{DateTime.Now.Second}";
            try
            {
                if (model.MusicFile != null)
                {
                    musicFileName = $"{user.Login}_{dateTimeNow}_" + model.MusicFile.FileName;
                    music.MusicUrl = await cloudService.EditFile("", music.MusicFileName, "", musicFileName, model.MusicFile.OpenReadStream());
                    music.MusicFileName = musicFileName;
                }
                if (model.MusicImageFile != null)
                {
                    imageFileName = $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName;
                    if (music.MusicImageName != $"{options.Value.DefaultMusicImageFile}")
                    {
                        music.MusicImageUrl = await cloudService.EditFile("", music.MusicImageName, "", imageFileName, model.MusicImageFile.OpenReadStream());
                        music.MusicImageName = imageFileName;
                    }
                    else
                    {
                        music.MusicImageUrl = await cloudService.AddFile("", imageFileName, model.MusicImageFile.OpenReadStream());
                        music.MusicImageName = imageFileName;
                    }
                }
                music.MusicName = model.MusicName;
                music.MusicGenreId = model.MusicGenreId;
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<IActionResult> DeleteMusic(int musicId, int UserId)
        {
            Music music = await db.Musics.Where(m=>m.MusicId==musicId && m.UserId==UserId).FirstOrDefaultAsync();
            if (music != null)
            {
                try
                {
                    await cloudService.DeleteFile("", music.MusicFileName);
                    if (music.MusicImageName != $"{options.Value.DefaultMusicImageFile}")
                        await cloudService.DeleteFile("", music.MusicImageName);
                    db.Musics.Remove(music);
                    await db.SaveChangesAsync();
                    return new OkResult();
                }
                catch (Exception ex)
                {
                    return new StatusCodeResult(500);
                }
            }
            return new NotFoundResult();
        }

        public async Task<RatedMusicResult> RateMusic(MusicStarRating model)
        {
            RatedMusicResult result = new RatedMusicResult();
            try
            {
                var entity = await db.MusicStarRatings.FindAsync(model.MusicId, model.UserId);
                if (entity == null)
                    db.MusicStarRatings.Add(new MusicStarRating { MusicId = model.MusicId, UserId = model.UserId, Rating = model.Rating });
                else
                    entity.Rating = model.Rating;
                await db.SaveChangesAsync();
                double sumRating = 0;
                var rating = await db.MusicStarRatings.Where(r => r.MusicId == model.MusicId).ToListAsync();
                foreach (var r in rating)
                    sumRating += r.Rating;
                result.Rating = Math.Round(sumRating / rating.Count, 1);
                result.CountRatings = rating.Count;
                result.RatedMusic = true;
            }
            catch
            {
                result.RatedMusic = false;
            }
            return result;
        }
    }
}
