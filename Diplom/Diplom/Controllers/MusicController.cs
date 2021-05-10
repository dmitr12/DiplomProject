using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Interfaces;
using Diplom.Managers;
using Diplom.Models;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.RatingModels;
using Diplom.Models.UserModels;
using Diplom.Utils;
using Dropbox.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly MusicManager musicManager;
        private readonly IHubContext<SignalHub> hubContext;
        private readonly int CountMusics = 10;
        private readonly string RatedMusic = "RatedMusic";
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);
        private int RoleId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.Role).Value);

        private DropboxClient dbx;

        public MusicController(MusicManager musicManager, IHubContext<SignalHub> hubContext, IOptions<DropBoxOptions> options)
        {
            this.musicManager = musicManager;
            this.hubContext = hubContext;
            dbx = new DropboxClient(options.Value.DropBoxToken);
        }

        [HttpGet("FilterMusic")]
        public List<MusicInfo> GetFilteredList(string musicName, int genreId)
        {
            try
            {
                return musicManager.GetFilteredList(musicName, genreId).Result;
            }
            catch
            {
                Response.StatusCode = 500;
            }
            return new List<MusicInfo>();
        }

        [HttpGet("ListMusicGenres")]
        public List<MusicGenre> GetMusicGenres()
        {
            return musicManager.GetMusicGenresList().Result;
        }

        [HttpGet("GetMusicByPlaylist/{playlistId}")]
        public List<MusicInfo> GetMusicByPlaylist(int playlistId)
        {
            return musicManager.GetMusicByPlaylist(playlistId).Result;
        }

        [HttpGet("GetMusic/{musicId}")]
        public MusicInfo GetMusic(int musicId)
        {
            if(User.Identity.IsAuthenticated)
                return musicManager.GetMusic(musicId, UserId).Result;
            return musicManager.GetMusic(musicId).Result;
        }

        [HttpGet("ListMusicsByUserId")]
        [Authorize]
        public List<MusicInfo> GetMusicsByUserId()
        {
            return musicManager.GetMusicsByUserId(UserId).Result;
        }

        [HttpGet("GetPartOfMusicsPyUserId/{lastIndex}")]
        [Authorize]
        public List<MusicInfo> GetPartOfListMusic(int lastIndex)
        {
            return musicManager.GetPartOfMusicsByUserId(UserId, CountMusics, lastIndex).Result;
        }

        [HttpPost("AddMusic")]
        [Authorize]
        public IActionResult AddMusic([FromForm] AddMusicModel model)
        {
            return musicManager.AddMusic(model, UserId).Result;
        }

        [HttpPut("EditMusic")]
        [Authorize]
        public IActionResult EditMusic([FromForm] EditMusicModel model)
        {
            return musicManager.EditMusic(model, UserId).Result;
        }

        [HttpDelete("DeleteMusic/{idMusic}")]
        [Authorize]
        public IActionResult DeleteMusic(int idMusic)
        {
            return musicManager.DeleteMusic(idMusic, UserId, RoleId).Result;
        }

        [HttpPost("RateMusic")]
        [Authorize]
        public async Task<IActionResult> RateMusic(UsersMusic model)
        {
            var ratedResult = musicManager.RateMusic(model).Result;
            if (ratedResult.RatedMusic)
            {
                await hubContext.Clients.All.SendAsync(RatedMusic, ratedResult);
            }
            return StatusCode(200, ratedResult);
        }

        [HttpGet("{musicFileName}")]
        public async Task<IActionResult> Download(string musicFileName)
        {
            var response = await dbx.Files.DownloadAsync($"/{musicFileName}");
            Response.Headers.Add("Content-Length", response.Response.AsFile.Size.ToString());
            Response.Headers.Add("Accept-Ranges", "bytes");
            return new FileStreamResult(await response.GetContentAsStreamAsync(), "audio/mp3");
        }

        [HttpPost("LikeMusic")]
        [Authorize]
        public IActionResult LikeMusic(UsersMusic model)
        {
            return musicManager.LikeMusic(model).Result;
        }
    }
}
