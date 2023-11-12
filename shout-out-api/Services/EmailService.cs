using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using shout_out_api.Helpers;
using shout_out_api.Dto.Email;
using shout_out_api.Interfaces;

namespace shout_out_api.Services
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
                email.Body = new TextPart(TextFormat.Html) { Text = model.Body };

                foreach (var userEmail in userEmails)
                {
                    email.Bcc.Add(MailboxAddress.Parse(userEmail));
                }

                using var smtp = new SmtpClient();
                smtp.Connect(_configHelper.SMTP.Host, _configHelper.SMTP.Port, SecureSocketOptions.StartTls);
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
                email.Body = new TextPart(TextFormat.Html) { Text = model.Body };

                using var smtp = new SmtpClient();
                smtp.Connect(_configHelper.SMTP.Host, _configHelper.SMTP.Port, SecureSocketOptions.StartTls);
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
