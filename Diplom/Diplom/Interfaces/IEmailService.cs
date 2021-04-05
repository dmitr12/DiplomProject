using Diplom.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Diplom.Interfaces
{
    public interface IEmailService
    {
        Task<EmailResult> Send(EmailInfo emailInfo);
    }
}
