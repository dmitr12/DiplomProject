using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models.FollowerModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowerController : ControllerBase
    {
        private readonly FollowerManager manager;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public FollowerController(FollowerManager manager)
        {
            this.manager = manager;
        }

        [HttpPost("AddFollower")]
        [Authorize]
        public IActionResult AddFollower(EditFollower editFollower)
        {
            return manager.AddFollower(editFollower.UserToFollowId, UserId).Result;
        }

        [HttpGet("IsCurrentUserFollowed/{userToFollowId}")]
        [Authorize]
        public bool IsCurrentUserFollowed(int userToFollowId)
        {
            return manager.IsUserFollowed(userToFollowId, UserId).Result;
        }

        [HttpDelete("DeleteFollower/{userToFollowId}")]
        [Authorize] 
        public IActionResult DeleteFollower(int userToFollowId)
        {
            return manager.DeleteFollower(userToFollowId, UserId).Result;
        }
    }
}
