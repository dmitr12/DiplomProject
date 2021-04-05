using Diplom.Interfaces;
using Diplom.Models.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Diplom.Services
{
    public class EmailService : IEmailService
    {
        private readonly string fromEmail = "appemail9999@gmail.com";
        private readonly string fromEmailPassword = "walking78351";

        public async Task<EmailResult> Send(EmailInfo emailInfo)
        {
            var result = new EmailResult();
            result.EmailInfo = emailInfo;
            try
            {
                using(var mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(fromEmail);
                    emailInfo.ToMails.ForEach(m => mailMessage.To.Add(m));
                    mailMessage.Subject = emailInfo.Subject;
                    mailMessage.Body = emailInfo.Body;
                    mailMessage.IsBodyHtml = emailInfo.IsBodyHtml;
                    using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new NetworkCredential(fromEmail, fromEmailPassword);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mailMessage);
                        result.Sended = true;
                    }
                }
            }
            catch(Exception ex)
            {
                result.ErrorMessage = ex.Message;
                result.Sended = false;
            }
            return result;
        }
    }
}
