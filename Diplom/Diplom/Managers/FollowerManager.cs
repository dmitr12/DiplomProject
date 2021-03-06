using Diplom.Models;
using Diplom.Models.FollowerModels;
using Diplom.Models.UsersNotifications;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class FollowerManager
    {
        private readonly DataBaseContext db;

        public FollowerManager(DataBaseContext db)
        {
            this.db = db;
        }

        public async Task<IActionResult> AddFollower(int userToFollowId, int currentUserId)
        {
            try
            {
                var currentUser = await db.Users.FindAsync(currentUserId);
                if(currentUser == null)
                    return new NotFoundObjectResult(new { msg = "Текущий пользователь не найден" });
                var userToFollow = await db.Users.FindAsync(userToFollowId);
                if(userToFollow == null)
                    return new NotFoundObjectResult(new { msg = "Пользователь, на которого оформляется подписка, не найден" });
                db.Followers.Add(new Follower { UserId = userToFollowId, FollowedUserId = currentUserId });
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500); 
            }
        }

        public async Task<bool> IsUserFollowed(int userToFollowId, int followerId)
        {
            return db.Followers.Contains(await db.Followers.FindAsync(userToFollowId, followerId));
        }

        public async Task<IActionResult> DeleteFollower(int userToFollowId, int currentUserId)
        {
            try
            {
                var subscription = await db.Followers.FindAsync(userToFollowId, currentUserId);
                if (subscription == null)
                    return new NotFoundResult();
                db.Followers.Remove(subscription);
                var notifications = await (from un in db.UsersNotifications
                                           join n in db.Notifications on un.NotificationId equals n.NotificationId
                                           where n.UserId == userToFollowId && un.UserId == currentUserId
                                           select new UsersNotification
                                           {
                                               UserId = un.UserId,
                                               NotificationId = un.NotificationId,
                                               IsChecked = un.IsChecked
                                           }).ToListAsync();
                db.UsersNotifications.RemoveRange(notifications);
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }   
        }
    }
}
