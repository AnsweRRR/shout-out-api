using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using ShoutOut.Helpers;
using ShoutOut.Dto.Email;
using ShoutOut.Interfaces;
using Microsoft.Extensions.Logging;

namespace ShoutOut.Services
{
    public class EmailService: IEmailService
    {
        private readonly ILogger<IEmailService> _logger;
        private readonly ConfigHelper _configHelper;
        public EmailService(ILogger<IEmailService> logger, ConfigHelper configHelper)
        {
            _logger = logger;
            _configHelper = configHelper;
        }

        public void SendEmailToMultipleRecipients(List<string> userEmails, EmailDto model)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configHelper.SMTP.Sender));
                email.Subject = model.Subject;
                email.Body = model.Body;

                foreach (var userEmail in userEmails)
                {
                    email.Bcc.Add(MailboxAddress.Parse(userEmail));
                }

                SecureSocketOptions secureSocketOptions = _configHelper.SMTP.TargetName.StartsWith("STARTTLS") ? SecureSocketOptions.StartTls : SecureSocketOptions.SslOnConnect;

                using var smtp = new SmtpClient();
                smtp.Connect(_configHelper.SMTP.Host, _configHelper.SMTP.Port, secureSocketOptions);
                smtp.Authenticate(_configHelper.SMTP.UserName, _configHelper.SMTP.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        public void SendEmail(EmailDto model)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configHelper.SMTP.Sender));
                email.To.Add(MailboxAddress.Parse(model.ToEmailAddress));
                email.Subject = model.Subject;
                email.Body = model.Body;

                SecureSocketOptions secureSocketOptions = _configHelper.SMTP.TargetName.StartsWith("STARTTLS") ? SecureSocketOptions.StartTls : SecureSocketOptions.SslOnConnect;

                using var smtp = new SmtpClient();
                smtp.Connect(_configHelper.SMTP.Host, _configHelper.SMTP.Port, secureSocketOptions);
                smtp.Authenticate(_configHelper.SMTP.UserName, _configHelper.SMTP.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
    }
}
