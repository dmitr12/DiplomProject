using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.CommentModels
{
    public class MusicCommentResult
    {
        public bool Result { get; set; }
        public MusicCommentInfo MusicCommentInfo { get; set; } = new MusicCommentInfo();
    }
}
