using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.CommentModels
{

    public enum CommentChangedType
    {
        Added = 1,
        Deleted = 2
    }

    public class MusicCommentResult
    {
        public bool Result { get; set; }
        public CommentChangedType CommentChangedType { get; set; }
        public MusicCommentInfo MusicCommentInfo { get; set; } = new MusicCommentInfo();
    }
}
