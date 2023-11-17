using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.Email;
using shout_out_api.Interfaces;

namespace shout_out_api.Controllers
{
    public class TestController: ControllerBase
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IEmailService _emailService;

        public TestController(IWebHostEnvironment hostingEnvironment, IEmailService emailService)
        {
            _hostingEnvironment = hostingEnvironment;
            _emailService = emailService;
        }

        [HttpGet("testing")]
        public IActionResult TestEmailTemplating()
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "WelcomeEmailTemplate.html");
            var htmlContent = System.IO.File.ReadAllText(filePath);

            string name = "John Doe";
            htmlContent = htmlContent.Replace("{{Name}}", name);

            EmailDto emailModel = new EmailDto()
            {
                ToEmailAddress = "pogranyitamas99@gmail.com",
                Subject = "Testing email templating",
                Body = htmlContent
            };

            _emailService.SendEmail(emailModel);

            return Ok();
        }
    }
}
