namespace shout_out_api.Helpers
{
    public class EmailTemplates
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public EmailTemplates(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public string NEW_USER_CONFIRM_EMAIL_SUBJECT()
        {
            return "Invited to ShoutOut";
        }

        public string NEW_USER_CONFIRM_EMAIL_BODY(string confirmLink)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "WelcomeEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::confirmLink}}", confirmLink);

            return htmlContent;
        }
    }
}
