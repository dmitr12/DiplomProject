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
            var result = new MusicCommentResult();
            try
            {
                model.CommentDate = DateTime.Now;
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
                result.CommentChangedType = CommentChangedType.Added;
            }
            catch
            {
                result.Result = false;
            }
            return result;
        }

        public async Task<MusicCommentResult> DeleteMusicComment(Guid musicCommentId, int userId)
        {
            var result = new MusicCommentResult();
            try
            {
                var comment = await db.MusicComments.FindAsync(musicCommentId);
                db.MusicComments.Remove(comment);
                if(comment.ParentIdComment == null)
                {
                    var subComments = await db.MusicComments.Where(c => c.ParentIdComment == comment.IdComment).ToListAsync();
                    db.MusicComments.RemoveRange(subComments);
                }
                await db.SaveChangesAsync();
                var user = await db.Users.FindAsync(userId);
                result.MusicCommentInfo.IdComment = comment.IdComment;
                result.MusicCommentInfo.Comment = comment.Comment;
                result.MusicCommentInfo.CommentDate = comment.CommentDate;
                result.MusicCommentInfo.MusicId = comment.MusicId;
                result.MusicCommentInfo.ParentIdComment = comment.ParentIdComment;
                result.MusicCommentInfo.UserId = comment.UserId;
                result.MusicCommentInfo.UserLogin = user.Login;
                result.MusicCommentInfo.UserAvatar = user.Avatar;
                result.Result = true;
                result.CommentChangedType = CommentChangedType.Deleted;
            }
            catch
            {
                result.Result = false;
            }
            return result;
        }
    }
}
