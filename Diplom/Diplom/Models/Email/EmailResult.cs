using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.Email
{
    public class EmailResult
    {
        public EmailInfo EmailInfo { get; set; }
        public bool Sended { get; set; }
        public string ErrorMessage { get; set; }
    }
}
