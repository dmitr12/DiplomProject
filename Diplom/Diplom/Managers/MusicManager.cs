using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.NotificationModels;
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
        private readonly NotificationManager notificationManager;

        public MusicManager(DataBaseContext db, ICloudService cloudService, IOptions<DropBoxOptions> options, NotificationManager notificationManager)
        {
            this.db = db;
            this.cloudService = cloudService;
            this.options = options;
            this.notificationManager = notificationManager;
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

        public async Task<List<MusicInfo>> GetNewMusics()
        {
            return await db.Musics.OrderByDescending(m => m.DateOfPublication).Take(10).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
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

        public async Task<List<MusicInfo>> GetMusicByPlaylist(int playlistId)
        {
            return await (from pm in db.PlaylistsMusics
                          join m in db.Musics on pm.MusicId equals m.MusicId
                          join u in db.Users on m.UserId equals u.UserId
                          where pm.PlaylistId == playlistId
                          select new MusicInfo
                          {
                              Id = m.MusicId,
                              Name = m.MusicName,
                              MusicFileName = m.MusicFileName,
                              MusicUrl = m.MusicUrl,
                              MusicImageName = m.MusicImageName,
                              ImageUrl = m.MusicImageUrl,
                              GenreId = m.MusicGenreId,
                              UserId = m.UserId,
                              UserLogin = u.Login
                          }).ToListAsync();
        }

        public async Task<List<MusicInfo>> GetLiked(int userId)
        {
            return await (from um in db.UsersMusics
                          join m in db.Musics on um.MusicId equals m.MusicId
                          join u in db.Users on m.UserId equals u.UserId
                          where um.UserId == userId && um.Liked
                          select new MusicInfo
                          {
                              Id = m.MusicId,
                              Name = m.MusicName,
                              MusicFileName = m.MusicFileName,
                              MusicUrl = m.MusicUrl,
                              MusicImageName = m.MusicImageName,
                              ImageUrl = m.MusicImageUrl,
                              GenreId = m.MusicGenreId,
                              UserId = m.UserId,
                              UserLogin = u.Login
                          }).ToListAsync();
        }

        public async Task<MusicInfo> GetMusic(int musicId, int? currentUser = null)
        {
            double sumRating = 0;
            int? userRating = null;
            var currentUserLiked = false;
            var rating = await db.UsersMusics.Where(r => r.MusicId == musicId).ToListAsync();
            if(currentUser != null)
            {
                var currentUserMusic = rating.Find(r => r.UserId == currentUser);
                if(currentUserMusic != null)
                {
                    userRating = currentUserMusic.Rating;
                    currentUserLiked = currentUserMusic.Liked;
                }
            }
            foreach (var entity in rating)
            {
                if(entity.Rating > 0)
                    sumRating += entity.Rating;
            }
            var rtCount = rating.Where(um => um.Rating > 0).Count();
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
                CountRatings = rtCount,
                CurrentUserRating = userRating,
                CurrentUserLiked = currentUserLiked
            }).FirstOrDefaultAsync();
            if (musicInfo == null)
                return null;
            musicInfo.GenreName = db.MusicGenres.Find(musicInfo.GenreId).GenreName;
            if (sumRating == 0)
                musicInfo.Rating = sumRating;
            else
                musicInfo.Rating = Math.Round(sumRating / rtCount, 1);
            return musicInfo;
        }

        public async Task<IActionResult> LikeMusic(UsersMusic model)
        {
            try
            {
                var usersmusics = await db.UsersMusics.FindAsync(model.UserId, model.MusicId);
                if (usersmusics == null)
                    db.UsersMusics.Add(new UsersMusic { UserId = model.UserId, MusicId = model.MusicId, Rating = 0, Liked = true });
                else
                    usersmusics.Liked = model.Liked;
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
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
                UserLogin = u.Login
            }).Take(count).ToListAsync();
        }

        public async Task<IActionResult> AddMusic(AddMusicModel model, int userId)
        {
            var dtNow = DateTime.Now;
            User user = await db.Users.FindAsync(userId);
            string dateTimeNow = $"{dtNow.Day}.{dtNow.Month}.{dtNow.Year} {dtNow.Hour}:{dtNow.Minute}:{dtNow.Second}";
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
                    DateOfPublication = dtNow,
                    MusicGenreId = model.MusicGenreId
                };
                db.Musics.Add(music);
                await db.SaveChangesAsync();
                var notificationResult = notificationManager.AddNotification(new AddNotification { UserId = userId, SourceId = music.MusicId, NotificationType = NotificationType.AddedMusic,  
                Message = $"Пользователь {user.Login} добавил новую песню под названием {music.MusicName}"}).Result;
                if (!notificationResult.OperationCompleted)
                    throw new Exception(notificationResult.ErrorMessage);
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

        public async Task<IActionResult> DeleteMusic(int musicId, int UserId, int RoleId)
        {
            Music music;
            if (RoleId == (int)UserRoleEnum.Admin)
                music = await db.Musics.Where(m => m.MusicId == musicId).FirstOrDefaultAsync();
            else
                music = await db.Musics.Where(m => m.MusicId == musicId && m.UserId == UserId).FirstOrDefaultAsync();
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

        public async Task<RatedMusicResult> RateMusic(UsersMusic model)
        {
            RatedMusicResult result = new RatedMusicResult();
            try
            {
                var entity = await db.UsersMusics.FindAsync(model.UserId, model.MusicId);
                if (entity == null)
                    db.UsersMusics.Add(new UsersMusic { UserId = model.UserId, MusicId = model.MusicId, Rating = model.Rating, Liked = false });
                else
                    entity.Rating = model.Rating;
                await db.SaveChangesAsync();
                double sumRating = 0;
                var rating = await db.UsersMusics.Where(r => r.MusicId == model.MusicId).ToListAsync();
                foreach (var r in rating)
                {
                    if(r.Rating > 0)
                        sumRating += r.Rating;
                }
                result.Rating = Math.Round(sumRating / rating.Where(r=>r.Rating>0).Count(), 1);
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
