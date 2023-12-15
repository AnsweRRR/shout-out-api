namespace ShoutOut.Dto.PointSystem
{
    public class LikeDto
    {
        public int Id { get; set; }
        public int LikedById { get; set; }
        public string LikedByName { get; set; } = null!;
    }
}
