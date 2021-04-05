using Diplom.Interfaces;
using Diplom.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class EmailManager
    {
        private readonly IEmailService emailService;

        public EmailManager(IEmailService emailService)
        {
            this.emailService = emailService;
        }

        public EmailResult Send(EmailInfo emailInfo)
        {
            return emailService.Send(emailInfo).Result;
        }
    }
}
