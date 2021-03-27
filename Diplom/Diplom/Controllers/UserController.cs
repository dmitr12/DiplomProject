using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models.UserModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
                string token = userManager.GetToken(model).Result;
                if (token != null)
                    return Ok(new { token });
            }
            return Unauthorized();
        }

        [HttpPost("Register")]
        public IActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                return userManager.Register(model).Result;
            }
            return BadRequest();
        }

        [HttpGet("UserInfo")]
        [Authorize]
        public UserInfo GetUserInfo()
        {
            return userManager.GetUserInfo(UserId).Result;
        }
    }
}
