using GiphyApiWrapper.Models;
using ShoutOut.Dto.PointSystem;

namespace ShoutOut.Interfaces
{
    public interface IPointSystemService
    {
        Task<IList<FeedItem>> GetHistory(int userId, CancellationToken cancellationToken, int take = 10, int offset = 0);
        Task<GivePointsResultDto> GivePoints(int senderUserId, GivePointsDto model);
        Task<LikeDislikeResultDto> Like(int userId, int feedItemId);
        Task<LikeDislikeResultDto> Dislike(int userId, int feedItemId);
        Task<CommentDto> AddComment(int userId, CommentDto model);
        Task<CommentDto> EditComment(int userId, int id, CommentDto model);
        Task<DeleteCommentResultDto> DeleteComment(int userId, int id);
        Task ScheduledTask();
        Task<RootObject> GetGiphyGifs(int limit, int offset, string? filterName = null);
    }
}
