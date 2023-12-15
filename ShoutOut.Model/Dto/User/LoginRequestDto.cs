using System.ComponentModel.DataAnnotations;

namespace ShoutOut.Dto.User
{
    public class LoginRequestDto
    {
        [Required]
        public string Email { set; get; }
        [Required]
        public string Password { set; get; }
    }
}
