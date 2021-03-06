using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.NotificationModels
{
    public enum NotificationType
    {
        AddedMusic = 1,
        AddedPlaylist = 2
    }

    public class Notification
    {
        public int NotificationId { get; set; }
        public int UserId { get; set; }
        public int SourceId { get; set; }
        public NotificationType NotificationType { get; set; }
        public string Message { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
