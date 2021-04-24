using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.PlaylistModels
{
    public class PlaylistEditor
    {
        public int PlaylistId { get; set; }
        public string PlaylistName { get; set; }
        public string PlaylistDescription { get; set; }
        public IFormFile ImageFile { get; set; }
        public List<int> Musics { get; set; }
    }
}
