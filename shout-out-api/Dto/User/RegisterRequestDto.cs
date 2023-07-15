using shout_out_api.Enums;
using System.ComponentModel.DataAnnotations;

namespace shout_out_api.Dto.User
{
    public class RegisterRequestDto
    {
        [Required]
        public string UserName { set; get; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { set; get; }

        [Required]
        [Compare(nameof(Password))]
        [DataType(DataType.Password)]
        public string ConfirmPassword { set; get; }

        [Required]
        public string Token { get; set; }

        [Required]
        public DateTime Birthday { get; set; }

        [Required]
        public DateTime StartAtCompany { get; set; }

        public byte[] Avatar { get; set; }
    }
}
