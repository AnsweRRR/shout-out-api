using System.ComponentModel.DataAnnotations;

namespace ShoutOut.Dto.PointSystem
{
    public class GivePointsDto
    {
        [Required]
        public List<string> HashTags { get; set; } = new List<string>();

        [Required]
        public int Amount { get; set; }

        [Required]
        public List<int> ReceiverUsers { get; set; } = new List<int>();

        public string? GiphyGifUrl { get; set; }
    }
}
