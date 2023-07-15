using System.ComponentModel.DataAnnotations;

namespace shout_out_api.Dto.User
{
    public class LoginRequestDto
    {
        [Required]
        public string Email { set; get; }
        [Required]
        public string Password { set; get; }
    }
}
