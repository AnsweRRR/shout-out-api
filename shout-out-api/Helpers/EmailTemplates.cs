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

        public string PASSWORD_RESET_TOKEN_SUBJECT()
        {
            return "Forgot password";
        }

        public string PASSWORD_RESET_TOKEN_BODY(string passwordResetToken)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "ForgotPasswordEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::passwordResetToken}}", passwordResetToken);

            return htmlContent;
        }

        public string NEW_ITEM_CLAIM_EVENT_SUBJECT()
        {
            return "Item claimed in ShoutOut";
        }

        public string NEW_ITEM_CLAIM_EVENT_BODY(string userName, string itemName)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemClaimedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::userName}}", userName);
            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);

            return htmlContent;
        }

        public string NEW_ITEM_CREATED_SUBJECT()
        {
            return "New item is available in ShoutOut";
        }

        public string NEW_ITEM_CREATED_BODY(string itemName)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemCreatedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);

            return htmlContent;
        }
    }
}
