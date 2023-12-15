using ShoutOut.Enums;
using System.ComponentModel.DataAnnotations;

namespace ShoutOut.Dto.User
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

        [Required]
        public string EncodedUrl { get; set; }
    }
}
