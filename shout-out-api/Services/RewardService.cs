using GiphyDotNet.Model.GiphyImage;
using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Reward;
using shout_out_api.Helpers;
using shout_out_api.Model;

namespace shout_out_api.Services
{
    public class RewardService
    {
        private readonly Context _db;
        private readonly FileConverter _fileConverter;

        public RewardService(Context db, FileConverter fileConverter)
        {
            _db = db;
            _fileConverter = fileConverter;
        }

        public async Task<IList<RewardDto>> GetRewards()
        {
            try
            {
                List<Reward> rewards = await _db.Rewards.OrderBy(r => r.Cost).ToListAsync();
                List<RewardDto> rewardsDto = rewards.ToRewardResultDto();

                return rewardsDto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<RewardDto> AddReward(RewardCreateEditDto model)
        {
            try
            {
                var newReward = new Reward()
                {
                    Cost = model.Cost,
                    Description = model.Description,
                    Name = model.Name
                };

                if (model.Avatar != null && model.Avatar.Length > 0)
                {
                    byte[] file = _fileConverter.ConvertIFormFileToByteArray(model.Avatar);
                    newReward.Avatar = file;
                }

                await _db.Rewards.AddAsync(newReward);
                _db.SaveChanges();

                var rewardDto = newReward.ToRewardResultDto();

                return rewardDto;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task EditReward(int id, RewardCreateEditDto model)
        {
            try
            {
                var reward = await _db.Rewards.SingleOrDefaultAsync(r => r.Id == id);

                if(reward == null)
                {
                    throw new Exception("Reward not found");
                }

                reward.Description = model.Description;
                reward.Name = model.Name;
                reward.Cost = model.Cost;

                if (model.Avatar != null && model.Avatar.Length > 0)
                {
                    byte[] file = _fileConverter.ConvertIFormFileToByteArray(model.Avatar);
                    reward.Avatar = file;
                }

                _db.Update(reward);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task DeleteReward(int id)
        {
            try
            {
                var reward = await _db.Rewards.SingleOrDefaultAsync(r => r.Id == id);

                if (reward == null)
                {
                    throw new Exception("Reward not found");
                }

                _db.Remove(reward);
                _db.SaveChanges();
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<int> BuyReward(int id, int buyerUserId)
        {
            try
            {
                var reward = await _db.Rewards.SingleOrDefaultAsync(r => r.Id == id);

                if (reward == null)
                {
                    throw new Exception("Reward not found");
                }

                var price = reward.Cost;

                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == buyerUserId);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if (price > user.PointToHave)
                {
                    throw new Exception("Not enough balance");
                }
                
                user.PointToHave = user.PointToHave - price;
                _db.Update(user);
                _db.SaveChanges();

                return user.PointToHave;
            }
            catch(Exception ex)
            {
                throw;
            }
        }
    }
}
