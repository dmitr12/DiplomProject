using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UserModels
{
    public class ConfirmEmail
    {
        public int UserId { get; set; }
        public Guid VerifyCode { get; set; }
    }
}
