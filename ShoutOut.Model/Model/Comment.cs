using ShoutOut.Model.Interfaces;

namespace ShoutOut.Model
{
    public class Comment : IEntity
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public string? GiphyGifUrl { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime? EditDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int PointHistoryId { get; set; }
        public PointHistory PointHistory { get; set; } = null!;
    }
}
