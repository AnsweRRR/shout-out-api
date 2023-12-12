namespace shout_out_api.Dto.PointSystem
{
    public class LikeDislikeResultDto
    {
        public int FeedItemId { get; set; }
        public int LikedById { get; set; }
        public string? LikedByName { get; set; }
    }
}
