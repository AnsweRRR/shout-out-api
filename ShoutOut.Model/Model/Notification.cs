using ShoutOut.Model.Interfaces;

namespace ShoutOut.Model
{
    public class Notification : IEntity
    {
        public int Id { get; set; }
        public int? SenderUserId { get; set; }
        public User? SenderUser { get; set; }
        public int EventType { get; set; }
        public int ReceiverUserId { get; set; }
        public User ReceiverUser { get; set; } = null!;
        public DateTime DateTime { get; set; }
        public bool IsRead { get; set; }
        public int? PointAmount { get; set; }
        public int? RewardId { get; set; }
        public Reward? Reward { get; set; }
    }
}
