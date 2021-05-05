using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.NotificationModels
{
    public class AddNotification
    {
        public int UserId { get; set; }
        public int SourceId { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Message { get; set; }
        public string UserLogin { get; set; }
    }
}
