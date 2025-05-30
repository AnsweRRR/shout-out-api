﻿namespace ShoutOut.Dto.PointSystem
{
    public class CommentDto
    {
        public int? Id { get; set; }
        public string? Text { get; set; }
        public string? GiphyGif { get; set; }
        public int SenderId { get; set; }
        public string? SenderName { get; set; }
        public string? SenderAvatar { get; set; }
        public int PointHistoryId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? EditDate { get; set; }
    }
}
