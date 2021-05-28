using Diplom.Interfaces;
using Diplom.Models.Email;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Diplom.Services
{
    public class EmailService : IEmailService
    {
        private readonly string fromEmail = "appemail9999@gmail.com";
        private readonly string fromEmailPassword = "walking78351";
        private readonly string fromName = "MusicApp";

        public async Task<EmailResult> Send(EmailInfo emailInfo)
        {
            var result = new EmailResult();
            result.EmailInfo = emailInfo;
            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(fromName, fromEmail));
                emailInfo.ToMails.ForEach(m => emailMessage.To.Add(new MailboxAddress(m)));
                emailMessage.Subject = emailInfo.Subject;
                emailMessage.Body = new BodyBuilder()
                {
                    HtmlBody = emailInfo.Body
                }.ToMessageBody();
                using(var client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    client.Authenticate(fromEmail, fromEmailPassword);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                    result.Sended = true;
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
