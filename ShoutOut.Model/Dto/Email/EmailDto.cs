namespace ShoutOut.Dto.Email
{
    public class EmailDto
    {
        public string? ToEmailAddress { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
