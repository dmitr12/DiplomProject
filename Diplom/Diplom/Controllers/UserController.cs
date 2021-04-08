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
        private readonly IWebHostEnvironment environment;
        private readonly IHubContext<SignalHub> hubContext;
        private readonly string ChangeUserPassword = "ChangeUserPassword";
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public UserController(UserManager userManager, IWebHostEnvironment environment, IHubContext<SignalHub> hubContext)
        {
            this.userManager = userManager;
            this.environment = environment;
            this.hubContext = hubContext;
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
        public IActionResult EmailForgotPassword(ForgotPasswordModel model)
        {
            return userManager.SendEmailForgotPassword(model, $"{Request.Scheme}://{Request.Host.Value}").Result;
        }

        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword(ForgotPasswordModel model)
        {
            return userManager.ChangePassword(model).Result;
        }

        [HttpGet("EmailForgotPassword/{userId}")]
        public async Task<IActionResult> EmailForgotPassword(int userId)
        {
            var user = userManager.GetUser(userId).Result;
            if (userManager.IsMailConfirmed(user))
            {
                await hubContext.Clients.All.SendAsync(ChangeUserPassword, user);
            }
            var fileContents = System.IO.File.ReadAllText($@"{environment.WebRootPath}\EmailForgotPassword.html");
            return new ContentResult
            {
                Content = fileContents,
                ContentType = "text/html"
            };
        }

        [HttpGet("ConfirmEmail/{userId}")]
        public IActionResult ConfirmEmail(int userId)
        {
            userManager.ConfrimEmail(userId);
            var fileContents = System.IO.File.ReadAllText($@"{environment.WebRootPath}\index.html");
            return new ContentResult
            {
                Content = fileContents,
                ContentType = "text/html"
            };
        }

        [HttpGet("UserProfile/{userId}")]
        public UserInfo GetUserProfile(int userId)
        {
            return userManager.GetUserProfile(userId).Result;
        }
    }
}
