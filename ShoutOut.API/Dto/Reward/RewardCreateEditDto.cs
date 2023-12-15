using System.ComponentModel.DataAnnotations;

namespace ShoutOut.Dto.Reward
{
    public class RewardCreateEditDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Cost { get; set; }

        public IFormFile? Avatar { get; set; }
    }
}
