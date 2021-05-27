using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models.ComplaintModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintController : ControllerBase
    {
        private readonly ComplaintManager manager;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public ComplaintController(ComplaintManager manager)
        {
            this.manager = manager;
        }

        [HttpGet("IsUserComplained")]
        public bool IsUserComplained(int userId, int musicId)
        {
            return manager.IsUserComplained(userId, musicId).Result;
        }

        [HttpGet("AllComplaints")]
        [Authorize(Roles = "2")]
        public List<Complaint> GetAllComplaints()
        {
            return manager.GetAllComplaints().Result;
        }

        [HttpPut("CheckComplaint")]
        [Authorize(Roles = "2")]
        public IActionResult CheckComplaint(CheckComplaint model)
        {
            return manager.CheckComplaint(model).Result;
        }

        [HttpPost("AddComplaint")]
        [Authorize]
        public IActionResult AddComplaint(AddComplaintModel model)
        {
            return manager.AddComplaint(model, UserId).Result;
        }
    }
}
