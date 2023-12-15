using ShoutOut.Model.Interfaces;

namespace ShoutOut.Model
{
    public class Like : IEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int PointHistoryId { get; set; }
        public PointHistory PointHistory { get; set; } = null!;
    }
}
