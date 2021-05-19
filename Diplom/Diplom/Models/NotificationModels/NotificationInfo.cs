using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.NotificationModels
{
    public class NotificationInfo
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public int SourceId { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Message { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsChecked { get; set; }
    }
}
