namespace shout_out_api.Helpers
{
    public class EmailTemplates
    {
        protected const string HEADER_LOGO_PNG = "HEADER_LOGO.png";
        protected const string FOOTER_LOGO_PNG = "FOOTER_LOGO.png";

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
            var emailImages = GetEmailImagePath();
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "WelcomeEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::confirmLink}}", confirmLink);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            return htmlContent;
        }

        public string PASSWORD_RESET_TOKEN_SUBJECT()
        {
            return "Forgot password";
        }

        public string PASSWORD_RESET_TOKEN_BODY(string passwordResetToken)
        {
            var emailImages = GetEmailImagePath();
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "ForgotPasswordEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::passwordResetToken}}", passwordResetToken);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            return htmlContent;
        }

        public string NEW_ITEM_CLAIM_EVENT_SUBJECT()
        {
            return "Item claimed in ShoutOut";
        }

        public string NEW_ITEM_CLAIM_EVENT_BODY(string userName, string itemName, string itemImageSrc)
        {
            var emailImages = GetEmailImagePath();
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemClaimedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::userName}}", userName);
            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);
            htmlContent = htmlContent.Replace("{{_replace::claimedItemImage}}", itemImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            return htmlContent;
        }

        public string NEW_ITEM_CREATED_SUBJECT()
        {
            return "New item is available in ShoutOut";
        }

        public string NEW_ITEM_CREATED_BODY(string itemName, string itemImageSrc)
        {
            var emailImages = GetEmailImagePath();
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemCreatedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);
            htmlContent = htmlContent.Replace("{{_replace::newItemImage}}", itemImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            return htmlContent;
        }

        protected Dictionary<string, string> GetEmailImagePath()
        {
            Dictionary<string, string> haederFooterImages = new Dictionary<string, string>();

            var headerImagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", HEADER_LOGO_PNG);
            byte[] headerImageBytes = File.ReadAllBytes(headerImagePath);
            string headerBase64String = Convert.ToBase64String(headerImageBytes);
            string headerImageSrc = $"data:image/png;base64,{headerBase64String}";

            haederFooterImages.Add(HEADER_LOGO_PNG, headerImageSrc);

            var footerImagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", FOOTER_LOGO_PNG);
            byte[] footerImageBytes = File.ReadAllBytes(footerImagePath);
            string footerBase64String = Convert.ToBase64String(footerImageBytes);
            string footerImageSrc = $"data:image/png;base64,{footerBase64String}";

            haederFooterImages.Add(FOOTER_LOGO_PNG, footerImageSrc);

            return haederFooterImages;
        }
    }
}
