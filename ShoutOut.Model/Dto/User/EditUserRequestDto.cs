using Microsoft.AspNetCore.Http;
using ShoutOut.Enums;

namespace ShoutOut.Dto.User
{
    public class EditUserRequestDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public IFormFile? Avatar { get; set; }
        public Role? Role { get; set; }
        public DateTime? Birthday { get; set; } = null;
        public DateTime? StartAtCompany { get; set; } = null;
    }
}
