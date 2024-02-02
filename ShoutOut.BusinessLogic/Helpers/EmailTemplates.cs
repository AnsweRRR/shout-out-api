using Microsoft.AspNetCore.Hosting;
using MimeKit;
using MimeKit.Utils;

namespace ShoutOut.Helpers
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

        public MimeEntity NEW_USER_CONFIRM_EMAIL_BODY(string confirmLink)
        {
            var builder = new BodyBuilder();

            var emailImages = GetEmailImagePath(builder);
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "WelcomeEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::confirmLink}}", confirmLink);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            builder.HtmlBody = htmlContent;

            return builder.ToMessageBody();
        }

        public string PASSWORD_RESET_TOKEN_SUBJECT()
        {
            return "Forgot password";
        }

        public MimeEntity PASSWORD_RESET_TOKEN_BODY(string passwordResetToken)
        {
            var builder = new BodyBuilder();

            var emailImages = GetEmailImagePath(builder);
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "ForgotPasswordEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::passwordResetToken}}", passwordResetToken);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            builder.HtmlBody = htmlContent;

            return builder.ToMessageBody();
        }

        public string NEW_ITEM_CLAIM_EVENT_SUBJECT()
        {
            return "Item claimed in ShoutOut";
        }

        public MimeEntity NEW_ITEM_CLAIM_EVENT_BODY(string userName, string itemName, string itemImageSrc)
        {
            var builder = new BodyBuilder();

            var emailImages = GetEmailImagePath(builder);
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemClaimedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::userName}}", userName);
            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);
            htmlContent = htmlContent.Replace("{{_replace::claimedItemImage}}", itemImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            builder.HtmlBody = htmlContent;

            return builder.ToMessageBody();
        }

        public string NEW_ITEM_CREATED_SUBJECT()
        {
            return "New item is available in ShoutOut";
        }

        public MimeEntity NEW_ITEM_CREATED_BODY(string itemName, string itemImageSrc)
        {
            var builder = new BodyBuilder();

            var emailImages = GetEmailImagePath(builder);
            var headerImageSrc = emailImages.First(x => x.Key == HEADER_LOGO_PNG).Value;
            var footerImageSrc = emailImages.First(x => x.Key == FOOTER_LOGO_PNG).Value;

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "NewItemCreatedEmailTemplate.html");
            var htmlContent = File.ReadAllText(filePath);

            htmlContent = htmlContent.Replace("{{_replace::itemName}}", itemName);
            htmlContent = htmlContent.Replace("{{_replace::newItemImage}}", itemImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::headerLogo}}", headerImageSrc);
            htmlContent = htmlContent.Replace("{{_replace::footerLogo}}", footerImageSrc);

            builder.HtmlBody = htmlContent;

            return builder.ToMessageBody();
        }

        protected Dictionary<string, string> GetEmailImagePath(BodyBuilder builder)
        {
            Dictionary<string, string> haederFooterImages = new Dictionary<string, string>();

            var headerImagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", HEADER_LOGO_PNG);
            var headerImage = builder.LinkedResources.Add(headerImagePath);
            headerImage.ContentId = MimeUtils.GenerateMessageId();

            haederFooterImages.Add(HEADER_LOGO_PNG, $"cid:{headerImage.ContentId}");

            var footerImagePath = Path.Combine(_hostingEnvironment.WebRootPath, "images", FOOTER_LOGO_PNG);
            var footerImage = builder.LinkedResources.Add(footerImagePath);
            footerImage.ContentId = MimeUtils.GenerateMessageId();

            haederFooterImages.Add(FOOTER_LOGO_PNG, $"cid:{footerImage.ContentId}");

            return haederFooterImages;
        }
    }
}
