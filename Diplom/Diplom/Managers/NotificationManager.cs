using Diplom.Models;
using Diplom.Models.NotificationModels;
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
                    IsChecked = false,
                    CreateDate = DateTime.Now
                };
                db.Notifications.Add(notification);
                await db.SaveChangesAsync();
                var followers = await db.Followers.Where(f => f.UserId == notification.UserId).Select(f => f.FollowedUserId).ToListAsync();
                var notificationResult = new NotificationResult { Notification = notification, Followers = followers, OperationCompleted = true };
                await hubContext.Clients.All.SendAsync(Notification, notificationResult);
                return notificationResult;
            }
            catch(Exception ex)
            {
                return new NotificationResult { OperationCompleted = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<IActionResult> CheckNotification(Notification[] models)
        {
            try
            {
                var notificationIds = models.Select(n => n.NotificationId);
                var notifications = await db.Notifications.Where(n => notificationIds.Contains(n.NotificationId)).ToListAsync();
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

        public async Task<List<Notification>> GetNotificationsForUser(int userId)
        {
            return await (from f in db.Followers
                    join n in db.Notifications on f.UserId equals n.UserId
                    join u in db.Users on n.UserId equals u.UserId where f.FollowedUserId == userId
                    select new Notification { 
                        NotificationId = n.NotificationId,
                        UserId = n.UserId,
                        SourceId = n.SourceId,
                        NotificationType = n.NotificationType,
                        Message = n.Message,
                        CreateDate = n.CreateDate,
                        IsChecked = n.IsChecked
                    }).OrderByDescending(n=>n.CreateDate).ToListAsync();
        }
    }
}
