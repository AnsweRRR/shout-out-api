﻿using ShoutOut.Enums;

namespace ShoutOut.Dto.Notification
{
    public class CreateNotificationItemDto
    {
        public int ReceiverUserId { get; set; }
        public int? SenderUserId { get; set; }
        public NotificationEventType EventType { get; set; }
        public int? PointAmount { get; set; }
        public int? RewardId { get; set; }
    }
}
