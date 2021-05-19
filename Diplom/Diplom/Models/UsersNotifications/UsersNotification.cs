using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UsersNotifications
{
    public class UsersNotification
    {
        public int UserId { get; set; }
        public int NotificationId { get; set; }
        public bool IsChecked { get; set; }
    }
}
