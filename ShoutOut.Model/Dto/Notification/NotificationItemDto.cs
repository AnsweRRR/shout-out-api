using ShoutOut.Enums;

namespace ShoutOut.Dto.Notification
{
    public class NotificationItemDto
    {
        public int Id { get; set; }
        public string? SenderUserName { get; set; }
        public NotificationEventType EventType { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsRead { get; set; }
        public int? PointAmount { get; set; }
        public string? RewardName { get; set; }
    }
}
