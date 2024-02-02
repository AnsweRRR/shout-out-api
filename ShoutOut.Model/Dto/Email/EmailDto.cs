using MimeKit;

namespace ShoutOut.Dto.Email
{
    public class EmailDto
    {
        public string? ToEmailAddress { get; set; }
        public string Subject { get; set; } = string.Empty;
        public MimeEntity? Body { get; set; }
    }
}
