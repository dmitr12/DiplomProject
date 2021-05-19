using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models;
using Diplom.Models.NotificationModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationManager manager;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public NotificationController(NotificationManager manager)
        {
            this.manager = manager;
        }

        [HttpGet("GetForCurrentUser")]
        [Authorize]
        public List<NotificationInfo> GetNotificationsForCurrentUser()
        {
            return manager.GetNotificationsForUser(UserId).Result;
        }

        [HttpPut("CheckNotification")]
        [Authorize]
        public IActionResult CheckNotification(NotificationInfo[] notifications)
        {
            return manager.CheckNotification(notifications, UserId).Result;
        }
    }
}
