﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Models.UserModels
{
    public class ForgotPasswordModel
    {
        public int UserId { get; set; }
        public Guid VerifyCode { get; set; }
        public string Password { get; set; }
    }
}
