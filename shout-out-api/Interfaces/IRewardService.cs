using shout_out_api.Dto.Reward;

namespace shout_out_api.Interfaces
{
    public interface IRewardService
    {
        Task<IList<RewardDto>> GetRewards();
        Task<RewardDto> AddReward(RewardCreateEditDto model);
        Task<RewardDto> EditReward(int id, RewardCreateEditDto model);
        Task DeleteReward(int id);
        Task<int> BuyReward(int id, int buyerUserId);
    }
}
