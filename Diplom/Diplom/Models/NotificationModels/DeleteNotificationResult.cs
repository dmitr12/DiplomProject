using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.NotificationModels
{
    public class DeleteNotificationResult
    {
        public List<int> DeletedNotifications { get; set; }
        public bool OperationCompleted { get; set; }
        public string ErrorMessage { get; set; }
    }
}
