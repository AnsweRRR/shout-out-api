using shout_out_api.Enums;

namespace shout_out_api.Dto.User
{
    public class EditUserRequestDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public byte[] Avatar { get; set; }
        public Role Role { get; set; }
    }
}
