namespace shout_out_api.Dto.PointSystem
{
    public class CommentDto
    {
        public int? Id { get; set; }
        public string Text { get; set; } = null!;
        public string? GiphyGifUrl { get; set; }
        public int SenderId { get; set; }
        public string? SenderName { get; set; }
        public string? SenderAvatar { get; set; }
        public int PointHistoryId { get; set; }
    }
}
