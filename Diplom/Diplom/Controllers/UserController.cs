using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models.Email;
using Diplom.Models.UserModels;
using Diplom.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager userManager;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public UserController(UserManager userManager)
        {
            this.userManager = userManager;
        }

        [HttpPost("Login")]
        public IActionResult Login(AuthModel model)
        {
            if (ModelState.IsValid)
            {
                var user = userManager.GetUserByNameEmail(model).Result;
                if (user != null)
                {
                    if (!userManager.IsMailConfirmed(user))
                        return Forbid();
                    string token = userManager.GetToken(user);
                    if (token != null)
                        return Ok(new { token });
                }
            }
            return Unauthorized();
        }

        [HttpPost("Register")]
        public IActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                return userManager.Register(model, $"{Request.Scheme}://{Request.Host.Value}").Result;
            }
            return BadRequest();
        }

        [HttpGet("UserInfo")]
        [Authorize]
        public UserInfo GetUserInfo()
        {
            return userManager.GetUserInfo(UserId).Result;
        }

        [HttpPost("EmailForgotPassword")]
        public IActionResult EmailForgotPassword(EmailForgotPassword model)
        {
            return userManager.SendEmailForgotPassword(model, $"{Request.Scheme}://{Request.Host.Value}").Result;
        }

        [HttpPut("ForgotPasswordChange")]
        public IActionResult ForgotPasswordChange(ForgotPasswordModel model)
        {
            return userManager.ForgotPasswordChange(model).Result;
        }

        [HttpPut("ConfirmEmail")]
        public IActionResult ConfirmEmail(ConfirmEmail model)
        {
            return userManager.ConfirmEmail(model.UserId, model.VerifyCode).Result;
        }

        [HttpGet("UserProfile/{userId}")]
        public UserInfo GetUserProfile(int userId)
        {
            return userManager.GetUserProfile(userId).Result;
        }

        [HttpGet("FilterUsers")]
        public List<UserInfo> GetFilteredUsers(string login)
        {
            return userManager.FilterUsers(login).Result;
        }

        [HttpPut("EditUserProfile")]
        [Authorize]
        public IActionResult EditUserProfile([FromForm] EditProfile model)
        {
            return userManager.EditProfile(model, UserId).Result;
        }

        [HttpPut("ChangeUserPassword")]
        [Authorize]
        public IActionResult ChangeUserPassword(ChangePasswordModel model)
        {
            return userManager.ChangeUserPassword(model, UserId).Result;
        }
    }
}
