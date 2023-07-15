using System.ComponentModel.DataAnnotations;

namespace shout_out_api.Dto.PointSystem
{
    public class GivePointsDto
    {
        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int Amount { get; set; }

        [Required]
        public List<int> ReceiverUsers { get; set; } = new List<int>();
    }
}
