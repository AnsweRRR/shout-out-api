using GiphyApiWrapper.Models;
using shout_out_api.Dto.PointSystem;

namespace shout_out_api.Interfaces
{
    public interface IPointSystemService
    {
        Task<IList<FeedItem>> GetHistory(int take = 10, int offset = 0);
        Task<GivePointsResultDto> GivePoints(int senderUserId, GivePointsDto model);
        Task ScheduledTask();
        Task<RootObject> GetGiphyGifs(int limit, int offset, string? filterName = null);
    }
}
