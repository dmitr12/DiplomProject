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
        public UserManager(DataBaseContext db, IGeneratorToken generatorToken, IOptions<DropBoxOptions> options, EmailManager emailManager)
        {
            this.db = db;
            this.generatorToken = generatorToken;
            this.options = options;
            this.emailManager = emailManager;
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
                Avatar = options.Value.DefaultUserImageLink
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
                Mail = u.Mail
            }).FirstOrDefaultAsync();
            return userInfo;
        }

        public async Task ConfrimEmail(int userId)
        {
            var user = await db.Users.FindAsync(userId);
            user.IsMailConfirmed = true;
            await db.SaveChangesAsync();
        }
    }
}
