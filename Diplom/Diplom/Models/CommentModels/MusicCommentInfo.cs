using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.CommentModels
{
    public class MusicCommentInfo
    {
        public Guid? IdComment { get; set; }
        public string Comment { get; set; }
        public DateTime CommentDate { get; set; }
        public Guid? ParentIdComment { get; set; }
        public int MusicId { get; set; }
        public int UserId { get; set; }
        public string UserLogin { get; set; }
        public string UserAvatar { get; set; }
    }
}
