using shout_out_api.Dto.Email;

namespace shout_out_api.Interfaces
{
    public interface IEmailService
    {
        void SendEmailToMultipleRecipients(List<string> userEmails, EmailDto model);
        void SendEmail(EmailDto model);
    }
}
