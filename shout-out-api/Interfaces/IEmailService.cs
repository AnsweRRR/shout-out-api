using shout_out_api.Dto.Email;

namespace shout_out_api.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(EmailDto model);
    }
}
