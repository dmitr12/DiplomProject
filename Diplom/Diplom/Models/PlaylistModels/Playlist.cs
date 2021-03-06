using Diplom.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.PlaylistModels
{
    public class Playlist
    {
        public int PlaylistId { get; set; }
        public string PlaylistName { get; set; }
        public string PlaylistDescription { get; set; }
        public string PlaylistImageFile { get; set; }
        public string PlaylistImageUrl { get; set; }
        public int UserId { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
