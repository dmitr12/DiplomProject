using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.ComplaintModels
{
    public enum ComplaintType
    {
        Copyright = 1,
        Other = 2,
        Comment = 3
    }

    public class Complaint
    {
        public int ComplaintId { get; set; }
        public ComplaintType ComplaintType { get; set; }
        public int UserId { get; set; }
        public int MusicId { get; set; }
        public string Message { get; set; }
        public bool IsChecked { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
