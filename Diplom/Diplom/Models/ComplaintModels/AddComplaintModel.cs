using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.ComplaintModels
{
    public class AddComplaintModel
    {
        public ComplaintType ComplaintType { get; set; }
        public int MusicId { get; set; }
        public string Message { get; set; }
    }
}
