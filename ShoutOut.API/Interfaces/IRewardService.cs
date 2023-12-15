using ShoutOut.Dto.Reward;

namespace ShoutOut.Interfaces
{
    public interface IRewardService
    {
        Task<IList<RewardDto>> GetRewards(CancellationToken cancellationToken);
        Task<RewardDto> AddReward(RewardCreateEditDto model);
        Task<RewardDto> EditReward(int id, RewardCreateEditDto model);
        Task DeleteReward(int id);
        Task<int> BuyReward(int id, int buyerUserId);
        Task<List<RewardDto>> GetMostPopularRewards(CancellationToken cancellationToken);
    }
}
