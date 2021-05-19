using Diplom.Models;
using Diplom.Models.NotificationModels;
using Diplom.Models.UsersNotifications;
using Diplom.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class NotificationManager
    {
        private readonly DataBaseContext db;
        private readonly IHubContext<SignalHub> hubContext;
        private readonly string Notification = "Notification";

        public NotificationManager(DataBaseContext db, IHubContext<SignalHub> hubContext)
        {
            this.db = db;
            this.hubContext = hubContext;
        }

        public async Task<NotificationResult> AddNotification(AddNotification model)
        {
            try
            {
                var notification = new Notification
                {
                    UserId = model.UserId,
                    SourceId = model.SourceId,
                    NotificationType = model.NotificationType,
                    Message = model.Message,
                    CreateDate = DateTime.Now
                };
                db.Notifications.Add(notification);
                await db.SaveChangesAsync();
                var followers = await db.Followers.Where(f => f.UserId == notification.UserId).Select(f => f.FollowedUserId).ToListAsync();
                foreach (var followerId in followers)
                    db.UsersNotifications.Add(new UsersNotification { UserId = followerId, NotificationId = notification.NotificationId, IsChecked = false });
                await db.SaveChangesAsync();
                var notificationResult = new NotificationResult { Notification = notification, Followers = followers, OperationCompleted = true };
                await hubContext.Clients.All.SendAsync(Notification, notificationResult);
                return notificationResult;
            }
            catch(Exception ex)
            {
                return new NotificationResult { OperationCompleted = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<IActionResult> CheckNotification(NotificationInfo[] models, int currentUserId)
        {
            try
            {
                var notificationIds = models.Select(n => n.NotificationId);
                var notifications = await db.UsersNotifications.Where(n => notificationIds.Contains(n.NotificationId) && n.UserId == currentUserId).ToListAsync();
                foreach (var notification in notifications)
                    notification.IsChecked = true;
                await db.SaveChangesAsync();
                return new OkResult();
            }
            catch
            {
                return new StatusCodeResult(500);
            }
        }

        public async Task<List<NotificationInfo>> GetNotificationsForUser(int userId)
        {
            return await (from f in db.Followers
                          join n in db.Notifications on f.UserId equals n.UserId
                          join un in db.UsersNotifications on f.FollowedUserId equals un.UserId where f.FollowedUserId == userId && n.NotificationId == un.NotificationId
                          select new NotificationInfo
                          {
                              NotificationId = n.NotificationId,
                              UserId = n.UserId,
                              SourceId = n.SourceId,
                              NotificationType = n.NotificationType,
                              Message = n.Message,
                              CreateDate = n.CreateDate,
                              IsChecked = un.IsChecked
                          }).OrderByDescending(n => n.CreateDate).ToListAsync();
        }
    }
}
