using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.RatingModels
{
    public class UsersMusic
    {
        public int UserId { get; set; }
        public int MusicId { get; set; }
        public int Rating { get; set; }
        public bool Liked { get; set; }
    }
}
