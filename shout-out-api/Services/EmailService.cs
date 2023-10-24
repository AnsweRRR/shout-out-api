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
        private readonly ConfigHelper _configHelper;
        public EmailService(ConfigHelper configHelper)
        {
            _configHelper = configHelper;
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
                Console.WriteLine(ex.Message);
            }
        }
    }
}
