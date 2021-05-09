using Diplom.Interfaces;
using Diplom.Models;
using Diplom.Models.Email;
using Diplom.Models.UserModels;
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
    public class UserManager
    {

        private DataBaseContext db;
        private readonly IGeneratorToken generatorToken;
        private readonly IOptions<DropBoxOptions> options;
        private readonly EmailManager emailManager;
        private readonly ICloudService cloudService;
        public UserManager(DataBaseContext db, IGeneratorToken generatorToken, IOptions<DropBoxOptions> options, EmailManager emailManager, ICloudService cloudService)
        {
            this.db = db;
            this.generatorToken = generatorToken;
            this.options = options;
            this.emailManager = emailManager;
            this.cloudService = cloudService;
        }
        public string GetToken(User user)
        {
            if (user != null)
            {
                var token = generatorToken.GenerateToken(user);
                return token;
            }
            return null;
        }

        public bool IsMailConfirmed(User user)
        {
            return user == null ? false : user.IsMailConfirmed;
        }

        public async Task<User> GetUserByNameEmail(AuthModel model)
        {
            return await db.Users.Where(u => (u.Login == model.Login || u.Mail == model.Login) && u.Password == HashClass.GetHash(model.Password)).FirstOrDefaultAsync();
        }

        public async Task<User> GetUser(int userId)
        {
            return await db.Users.FindAsync(userId);
        }

        public async Task<IActionResult> Register(RegisterModel model, string baseUrl)
        {
            User us = await db.Users.Where(u => u.Mail == model.Mail).FirstOrDefaultAsync();
            if (us != null)
                return new OkObjectResult(new { msg = $"Пользователь с {model.Mail} уже зарегистрирован" });
            us = await db.Users.Where(u => u.Login == model.Login).FirstOrDefaultAsync();
            if (us != null)
                return new OkObjectResult(new { msg = $"Пользователь с {model.Login} уже зарегистрирован" });
            User user = new User
            {
                Mail = model.Mail,
                Login = model.Login,
                Password = HashClass.GetHash(model.Password),
                RoleId = 1,
                IsMailConfirmed = false,
                Avatar = options.Value.DefaultUserImageLink,
                AvatarFile = options.Value.DefaultUserImageFile,
                RegistrationDate = DateTime.Now
            };
            try
            {
                db.Users.Add(user);
                await db.SaveChangesAsync();
                var emailInfo = new EmailInfo();
                emailInfo.Subject = "Подтверждение почты в приложении MusicApp";
                emailInfo.Body = $"<div><p>Кликните по ссылке ниже, чтобы подтвердить свою почту</p><a href='{baseUrl}/api/user/ConfirmEmail/{user.UserId}'>Подтвердить почту</a></div>";
                emailInfo.ToMails.Add(user.Mail);
                var emailResult = emailManager.Send(emailInfo);
                if (!emailResult.Sended)
                    throw new Exception(emailResult.ErrorMessage);
                return new OkResult();
            }
            catch(Exception ex)
            {
                return new BadRequestObjectResult(ex.InnerException.Message);
            }
        }

        public async Task<UserInfo> GetUserInfo(int userId)
        {
            var userInfo = await db.Users.Where(u=>u.UserId == userId).Select(u=> new UserInfo { 
                UserId = u.UserId,
                RoleId = u.RoleId,
                Login = u.Login,
                Name = u.Name,
                IsMailConfirmed = u.IsMailConfirmed,
                Surname = u.Surname,
                Avatar = u.Avatar,
                City = u.City,
                Country = u.Country,
                Mail = u.Mail,
                RegistrationDate = u.RegistrationDate
            }).FirstOrDefaultAsync();
            return userInfo;
        }

        public async Task<List<UserInfo>> FilterUsers(string login)
        {
            var filter = new { Login = login == null ? "" : login };
            var loginFilter = filter.Login.Length > 0 ? filter.Login : string.Empty;

            return await db.Users.Where(u => EF.Functions.Like(u.Login, $"%{loginFilter}%")).Select(u => new UserInfo
            {
                UserId = u.UserId,
                RoleId = u.RoleId,
                Login = u.Login,
                Name = u.Name,
                IsMailConfirmed = u.IsMailConfirmed,
                Surname = u.Surname,
                Avatar = u.Avatar,
                City = u.City,
                Country = u.Country,
                Mail = u.Mail,
                RegistrationDate = u.RegistrationDate
            }).ToListAsync();
        }

        public async Task<IActionResult> ChangeUserPassword(ChangePasswordModel model, int userId)
        {
            try
            {
                var user = await db.Users.FindAsync(userId);
                if (user == null)
                    return new NotFoundResult();
                if (user.Password != HashClass.GetHash(model.OldPassword))
                    return new ForbidResult();
                user.Password = HashClass.GetHash(model.NewPassword);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public void ConfrimEmail(int userId)
        {
            var user = db.Users.Find(userId);
            user.IsMailConfirmed = true;
            db.SaveChanges();
        }

        public async Task<IActionResult> EditProfile(EditProfile model, int userId)
        {
            string imageFileName;
            var dateTimeNow = DateTime.Now;
            var createDate = $"{dateTimeNow.Day}.{dateTimeNow.Month}.{dateTimeNow.Year} {dateTimeNow.Hour}:{dateTimeNow.Minute}:{dateTimeNow.Second}";
            try
            {
                var user = await db.Users.FindAsync(userId);
                if (user == null)
                    return new NotFoundObjectResult(new { msg = "Пользователь не найден" });
                if (model.Avatar != null)
                {
                    imageFileName = $"{user.Login}_user_{createDate}_" + model.Avatar.FileName;
                    if(user.AvatarFile != options.Value.DefaultUserImageFile)
                    {
                        user.Avatar = await cloudService.EditFile("", user.AvatarFile, "", imageFileName, model.Avatar.OpenReadStream());
                        user.AvatarFile = imageFileName;
                    }
                    else
                    {
                        user.Avatar = await cloudService.AddFile("", imageFileName, model.Avatar.OpenReadStream());
                        user.AvatarFile = imageFileName;
                    }
                }
                user.City = model.City;
                user.Country = model.Country;
                user.Name = model.Name;
                user.Surname = model.Surname;
                await db.SaveChangesAsync();
                return new OkObjectResult(new { avatar = user.Avatar });
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<IActionResult> SendEmailForgotPassword(ForgotPasswordModel model, string baseUrl)
        {
            var user = await db.Users.Where(u => u.Mail == model.Email).FirstOrDefaultAsync();
            if (user != null)
            {
                if (!user.IsMailConfirmed)
                    return new OkObjectResult(new { msg = "Почта не подтверждена" });
                var emailInfo = new EmailInfo();
                emailInfo.Subject = "Заменя пароля в приложении MusicApp";
                emailInfo.Body = $"<div><p>Кликните по ссылке ниже, чтобы заменить пароль</p><a href='{baseUrl}/api/user/EmailForgotPassword/{user.UserId}'>Заменить пароль</a></div>";
                emailInfo.ToMails.Add(model.Email);
                var emailResult = emailManager.Send(emailInfo);
                if (emailResult.Sended)
                    return new OkResult();
                return new StatusCodeResult(500);
            }
            return new NotFoundResult();
        }

        public async Task<IActionResult> ChangePassword(ForgotPasswordModel model)
        {
            var user = await db.Users.Where(u => u.Mail == model.Email).FirstOrDefaultAsync();
            if (!IsMailConfirmed(user))
                return new BadRequestResult();
            if (user != null)
            {
                user.Password = HashClass.GetHash(model.Password);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            return new NotFoundResult();
        }

        public async Task<UserInfo> GetUserProfile(int userId)
        {
            var userInfo = new UserInfo();
            var user = await db.Users.FindAsync(userId);
            userInfo.UserId = user.UserId;
            userInfo.RoleId = user.RoleId;
            userInfo.Mail = user.Mail;
            userInfo.IsMailConfirmed = user.IsMailConfirmed;
            userInfo.Avatar = user.Avatar;
            userInfo.City = user.City;
            userInfo.Country = user.Country;
            userInfo.Login = user.Login;
            userInfo.Name = user.Name;
            userInfo.Surname = user.Surname;
            userInfo.UserId = user.UserId;
            userInfo.RegistrationDate = user.RegistrationDate;
            userInfo.CountMusics = await db.Musics.Where(m => m.UserId == userId).CountAsync();
            userInfo.CountComments = await db.MusicComments.Where(c => c.UserId == userId).CountAsync();
            userInfo.SummaryMusicRating = await db.Musics.Where(m => m.UserId == userId).Join(db.MusicStarRatings, m => m.MusicId, r => r.MusicId, (m, r) => r.Rating).SumAsync();
            return userInfo;
        }
    }
}
