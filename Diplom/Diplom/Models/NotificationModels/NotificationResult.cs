using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.NotificationModels
{
    public class NotificationResult
    {
        public Notification Notification { get; set; }
        public List<int> Followers { get; set; } = new List<int>();
        public bool OperationCompleted { get; set; }
        public string ErrorMessage { get; set; }
    }
}
