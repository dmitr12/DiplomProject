using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models;
using Diplom.Models.CommentModels;
using Diplom.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentManager manager;
        private readonly IHubContext<SignalHub> hubContext;
        private readonly string CommentOnMusic = "CommentOnMusic";

        public CommentController(CommentManager manager, IHubContext<SignalHub> hubContext)
        {
            this.manager = manager;
            this.hubContext = hubContext;
        }

        [HttpGet("{musicId}")]
        public List<MusicCommentInfo> GetCommentsByMusicId(int musicId)
        {
            return manager.GetCommentsForMusic(musicId).Result;
        }

        [HttpPost("CommnetOn")]
        [Authorize]
        public async Task<IActionResult> CommentOn(MusicComment comment)
        {
            var commentOnResult = manager.CommentOn(comment).Result;
            if (commentOnResult.Result)
            {
                await hubContext.Clients.All.SendAsync(CommentOnMusic, commentOnResult);
            }
            return StatusCode(200, commentOnResult);
        }
    }
}
