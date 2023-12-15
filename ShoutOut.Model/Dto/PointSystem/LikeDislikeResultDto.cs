namespace ShoutOut.Dto.PointSystem
{
    public class LikeDislikeResultDto
    {
        public int PointHistoryId { get; set; }
        public int LikedById { get; set; }
        public string? LikedByName { get; set; }
    }
}
