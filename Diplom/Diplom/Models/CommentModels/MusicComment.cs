using Diplom.Models.MusicModels;
using Diplom.Models.UserModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.CommentModels
{
    public class MusicComment
    {
        public Guid? IdComment { get; set; }
        public string Comment { get; set; }
        public DateTime CommentDate { get; set; }
        public int UserId { get; set; }
        public int MusicId { get; set; }
        public Guid? ParentIdComment { get; set; }
        public User User { get; set; }
        public Music Music { get; set; }
    }
}
