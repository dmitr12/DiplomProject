using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.PlaylistModels
{
    public class AddPlaylistModel
    {
        public string PlaylistName { get; set; }
        public string PlaylistDescription { get; set; }
        public IFormFile PlaylistImage { get; set; }
    }
}
