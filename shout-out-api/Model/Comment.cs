using shout_out_api.Model.Interfaces;

namespace shout_out_api.Model
{
    public class Comment : IEntity
    {
        public int Id { get; set; }
        public string Text { get; set; } = null!;
        public string? GiphyGifUrl { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.Now;
        public DateTime? EditDate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = new User();
        public int PointHistoryId { get; set; }
        public PointHistory PointHistory { get; set; } = new PointHistory();
    }
}
