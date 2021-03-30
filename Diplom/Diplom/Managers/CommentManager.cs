using Diplom.Models;
using Diplom.Models.CommentModels;
using Diplom.Models.MusicModels;
using Diplom.Utils;
using Microsoft.AspNetCore.SignalR;
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
            }).OrderBy(mc => mc.ParentIdComment).ThenByDescending(mc => mc.CommentDate).ToListAsync();
        }

        public async Task<MusicCommentResult> CommentOn(MusicComment model)
        {
            MusicCommentResult result = new MusicCommentResult();
            try
            {
                db.MusicComments.Add(model);
                db.SaveChanges();
                var user = await db.Users.FindAsync(model.UserId);
                result.MusicCommentInfo.IdComment = model.IdComment;
                result.MusicCommentInfo.Comment = model.Comment;
                result.MusicCommentInfo.CommentDate = model.CommentDate;
                result.MusicCommentInfo.MusicId = model.MusicId;
                result.MusicCommentInfo.ParentIdComment = model.ParentIdComment;
                result.MusicCommentInfo.UserId = model.UserId;
                result.MusicCommentInfo.UserLogin = user.Login;
                result.MusicCommentInfo.UserAvatar = user.Avatar;
                result.Result = true;
            }
            catch
            {
                result.Result = false;
            }
            return result;
        }
    }
}
