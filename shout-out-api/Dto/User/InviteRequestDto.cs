using shout_out_api.Enums;
using System.ComponentModel.DataAnnotations;

namespace shout_out_api.Dto.User
{
    public class InviteRequestDto
    {
        [Required]
        public string Email { set; get; }

        [Required]
        public Role Role { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
    }
}
