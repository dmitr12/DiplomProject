using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.MusicModels
{
    public class MusicInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string MusicFileName { get; set; }
        public string MusicUrl { get; set; }
        public string MusicImageName { get; set; }
        public string ImageUrl { get; set; }
        public int GenreId { get; set; }
        public int UserId { get; set; }
        public string UserLogin { get; set; }
        public int[] IdOfUsersLike { get; set; }
    }
}
