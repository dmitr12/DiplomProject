﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Diplom.Managers;
using Diplom.Models.PlaylistModels;
using Diplom.Models.PlaylistsMusicsModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Diplom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistController : ControllerBase
    {
        private readonly PlaylistManager playlistManager;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);

        public PlaylistController(PlaylistManager playlistManager)
        {
            this.playlistManager = playlistManager;
        }

        [HttpPost("AddPlaylist")]
        [Authorize]
        public IActionResult AddPlaylist([FromForm] AddPlaylistModel model)
        {
            return playlistManager.AddPlaylist(model, UserId).Result;
        }

        [HttpPut("EditPlaylist")]
        [Authorize]
        public IActionResult EditPlaylist([FromForm] PlaylistEditor model)
        {
            var s = "asd";
            return null;
        }

        [HttpGet("UserPlaylists")]
        [Authorize]
        public List<PlaylistInfo> GetUserPlaylists()
        {
            return playlistManager.GetUserPlaylists(UserId).Result;
        }

        [HttpGet("PlaylistInfo/{playlistId}")]
        [Authorize]
        public PlaylistInfo GetPlaylistInfo(int playlistId)
        {
            return playlistManager.GetPlaylistInfo(playlistId).Result;
        }

        [HttpPost("AddMusic")]
        [Authorize]
        public IActionResult AddMusic(PlaylistsMusic model)
        {
            return playlistManager.AddMusic(model, UserId).Result;
        }
    }
}