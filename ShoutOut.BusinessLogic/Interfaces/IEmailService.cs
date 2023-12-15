using ShoutOut.Dto.Email;

namespace ShoutOut.Interfaces
{
    public interface IEmailService
    {
        void SendEmailToMultipleRecipients(List<string> userEmails, EmailDto model);
        void SendEmail(EmailDto model);
    }
}
