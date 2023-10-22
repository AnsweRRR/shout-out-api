namespace shout_out_api.Model
{
    public class Notification
    {
        public int Id { get; set; }
        public int? SenderUserId { get; set; }
        public User? SenderUser { get; set; }
        public int EventType { get; set; }
        public int ReceiverUserId { get; set; }
        public User ReceiverUser { get; set; } = new User();
        public DateTimeOffset DateTime { get; set; }
        public bool IsRead { get; set; }
        public int? PointAmount { get; set; }
        public int? RewardId { get; set; }
        public Reward? Reward { get; set; }
    }
}
