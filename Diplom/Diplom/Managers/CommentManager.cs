using Diplom.Models;
using Diplom.Models.CommentModels;
using Diplom.Models.MusicModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class CommentManager
    {
        private readonly DataBaseContext db;

        public CommentManager(DataBaseContext db)
        {
            this.db = db;
        }

        public async Task<List<MusicCommentInfo>> GetCommentsForMusic(int musicId)
        {
            return await db.MusicComments.Where(c => c.MusicId == musicId).Join(db.Users, c => c.UserId, u => u.UserId, (c, u) => new MusicCommentInfo
            {
                IdComment = c.IdComment,
                Comment = c.Comment,
                CommentDate = c.CommentDate,
                ParentIdComment = c.ParentIdComment,
                MusicId = c.MusicId,
                UserId = c.UserId,
                UserLogin = u.Login,
                UserAvatar = u.Avatar
            }).ToListAsync();
        }
    }
}
