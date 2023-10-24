using shout_out_api.Enums;

namespace shout_out_api.Dto.PointSystem
{
    public class FeedItem
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        public int? SenderId { get; set; }
        public string? SenderName { get; set; }
        public string? SenderAvatar { get; set; }
        public DateTime EventDate { get; set; }
        public string? Description { get; set; }
        public PointEventType EventType { get; set; }
        public string? GiphyGif { get; set; }
        public List<ReceiverUsers> ReceiverUsers { get; set; } = new List<ReceiverUsers>();
    }

    public class ReceiverUsers
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;
    }
}
