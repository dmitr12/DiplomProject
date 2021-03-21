using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Interfaces;
using Diplom.Managers;
using Diplom.Models;
using Diplom.Models.GenreModels;
using Diplom.Models.MusicModels;
using Diplom.Models.UserModels;
using Diplom.Utils;
using Dropbox.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly MusicManager musicManager;
        private readonly int CountMusics = 10;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public MusicController(MusicManager musicManager)
        {
            this.musicManager = musicManager;
        }

        [HttpGet("ListMusicGenres")]
        public List<MusicGenre> GetMusicGenres()
        {
            return musicManager.GetMusicGenresList().Result;
        }

        [HttpGet("ListMusicsByUserId")]
        [Authorize(Roles = "1")]
        public List<Music> GetMusicsByUserId()
        {
            return musicManager.GetMusicsByUserId(UserId).Result;
        }

        [HttpGet("GetPartOfMusicsPyUserId/{lastIndex}")]
        [Authorize(Roles = "1")]
        public List<Music> GetPartOfListMusic(int lastIndex)
        {
            return musicManager.GetPartOfMusicsByUserId(UserId, CountMusics, lastIndex).Result;
        }

        [HttpPost("AddMusic")]
        [Authorize(Roles = "1")]
        public IActionResult AddMusic([FromForm] AddMusicModel model)
        {
            return musicManager.AddMusic(model, UserId).Result;
        }

        [HttpDelete("DeleteMusic/{idMusic}")]
        [Authorize(Roles = "1")]
        public IActionResult DeleteMusic(int idMusic)
        {
            return musicManager.DeleteMusic(idMusic, UserId).Result;
        }

        //[HttpGet]
        //public async Task<IActionResult> TestGet()
        //{
        //    var response = await dbx.Files.DownloadAsync("/TestLogin_18.3.2021 21:30:2_m.mp3");
        //    Stream str = await response.GetContentAsStreamAsync();
        //    Response.Headers.Add("Accept-Ranges", "bytes");
        //    var list = await dbx.Files.ListFolderAsync("");
        //    Response.Headers.Add("Content-Length", list.Entries.Where(i => i.Name == "TestLogin_18.3.2021 21:30:2_m.mp3").FirstOrDefault().AsFile.Size.ToString());
        //    return new FileStreamResult(str, "audio/mp3");
        //}
    }
}
