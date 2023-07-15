using System.ComponentModel.DataAnnotations;

namespace shout_out_api.Dto.Reward
{
    public class RewardCreateEditDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Cost { get; set; }

        public byte[] Avatar { get; set; }
    }
}
