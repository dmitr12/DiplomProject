using Diplom.Models;
using Diplom.Models.NotificationModels;
using Diplom.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Quartz
{
    public class NotificationCleaner : IJob
    {
        private readonly IServiceScopeFactory serviceScopeFactory;
        private readonly string CleanNotifications = "CleanNotifications";

        public NotificationCleaner(IServiceScopeFactory serviceScopeFactory)
        {
            this.serviceScopeFactory = serviceScopeFactory;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            using(var scope = serviceScopeFactory.CreateScope())
            {
                var notificationResult = new DeleteNotificationResult();
                var db = scope.ServiceProvider.GetService<DataBaseContext>();
                var hub = scope.ServiceProvider.GetService<IHubContext<SignalHub>>();
                try
                {
                    var dateTimeNow = DateTime.Now;
                    var notificationsForDelete = await db.Notifications.Where(n => db.UsersNotifications.Where(un=>un.NotificationId == n.NotificationId).All(un=>un.IsChecked)
                    && n.CreateDate.AddDays(1) < dateTimeNow).ToListAsync();
                    db.Notifications.RemoveRange(notificationsForDelete);

                    await db.SaveChangesAsync();

                    notificationResult.DeletedNotifications = notificationsForDelete.Select(n => n.NotificationId).ToList();
                    notificationResult.OperationCompleted = true;
                    await hub.Clients.All.SendAsync(CleanNotifications, notificationResult);
                }
                catch(Exception ex)
                {
                    notificationResult.OperationCompleted = false;
                    notificationResult.ErrorMessage = ex.Message;
                    await hub.Clients.All.SendAsync(CleanNotifications, notificationResult);
                }
            }
        }
    }
}
