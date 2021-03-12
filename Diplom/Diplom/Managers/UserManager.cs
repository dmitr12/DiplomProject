using Diplom.Interfaces;
using Diplom.Models;
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
        public UserManager(DataBaseContext db, IGeneratorToken generatorToken)
        {
            this.db = db;
            this.generatorToken = generatorToken;
        }
        public async Task<string> GetToken(AuthModel model)
        {
            User user = await db.Users.Where(u => (u.Login == model.Login || u.Mail==model.Login) && u.Password == HashClass.GetHash(model.Password)).FirstOrDefaultAsync(); 
            if (user != null)
            {
                var token = generatorToken.GenerateToken(user);
                return token;
            }
            return null;
        }

        public async Task<IActionResult> Register(RegisterModel model)
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
                IsMailConfirmed = false
            };
            try
            {
                db.Users.Add(user);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch(Exception ex)
            {
                return new BadRequestObjectResult(ex.InnerException.Message);
            }

        }
    }
}
