using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models;
using Diplom.Models.CommentModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentManager manager;

        public CommentController(CommentManager manager)
        {
            this.manager = manager;
        }

        [HttpGet("{musicId}")]
        public List<MusicCommentInfo> GetCommentsByMusicId(int musicId)
        {
            return manager.GetCommentsForMusic(musicId).Result;
        }
    }
}
