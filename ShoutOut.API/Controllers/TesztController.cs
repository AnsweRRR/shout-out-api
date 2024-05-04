using Microsoft.AspNetCore.Mvc;
using MimeKit.Utils;
using MimeKit;
using ShoutOut.Helpers;
using MailKit.Security;
using MailKit.Net.Smtp;

namespace ShoutOut.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TesztController : ControllerBase
    {
        protected const string HEADER_LOGO_PNG = "HEADER_LOGO.png";
        protected const string FOOTER_LOGO_PNG = "FOOTER_LOGO.png";

        private readonly ConfigHelper _configHelper;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public TesztController(ConfigHelper configHelper, IWebHostEnvironment hostingEnvironment)
        {
            _configHelper = configHelper;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public IActionResult EmailTeszt()
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configHelper.SMTP.Sender));
            email.Subject = "Kép teszt";

            string sendTo = "pogranyitamas99@gmail.com";
            email.Bcc.Add(MailboxAddress.Parse(sendTo));

            var builder = new BodyBuilder();

            var headerImagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", HEADER_LOGO_PNG);
            var headerImage = builder.LinkedResources.Add(headerImagePath);
            headerImage.ContentId = MimeUtils.GenerateMessageId();
            builder.HtmlBody = $"<html><body><img src=\"cid:{headerImage.ContentId}\">" +
                               $"<p>Your other email content here with images embedded.</p></body></html>";

            email.Body = builder.ToMessageBody();

            SecureSocketOptions secureSocketOptions = _configHelper.SMTP.TargetName.StartsWith("STARTTLS") ? SecureSocketOptions.StartTls : SecureSocketOptions.SslOnConnect;

            using var smtp = new SmtpClient();
            smtp.Connect(_configHelper.SMTP.Host, _configHelper.SMTP.Port, secureSocketOptions);
            smtp.Authenticate(_configHelper.SMTP.UserName, _configHelper.SMTP.Password);
            smtp.Send(email);
            smtp.Disconnect(true);

            return Ok();
        }
    }
}
