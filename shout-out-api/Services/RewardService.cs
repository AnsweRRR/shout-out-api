using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Reward;
using shout_out_api.Model;

namespace shout_out_api.Services
{
    public class RewardService
    {
        private readonly Context _db;

        public RewardService(Context db)
        {
            _db = db;
        }

        public async Task<IList<Reward>> GetRewards()
        {
            try
            {
                List<Reward> rewards = _db.Rewards.ToListAsync().Result;

                return rewards;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<Reward> AddReward(RewardCreateEditDto model)
        {
            try
            {
                var newReward = new Reward()
                {
                    Cost = model.Cost,
                    Description = model.Description,
                    Name = model.Name,
                    Avatar = model.Avatar
                };

                await _db.Rewards.AddAsync(newReward);
                _db.SaveChanges();

                return newReward;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<Reward> EditReward(int id, RewardCreateEditDto model)
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
                reward.Avatar = model.Avatar;
                reward.Cost = model.Cost;

                _db.Update(reward);
                _db.SaveChanges();

                return reward;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async void DeleteReward(int id)
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

        public async Task<Reward> BuyReward(int id, int buyerUserId)
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

                return reward;
            }
            catch(Exception ex)
            {
                throw;
            }
        }
    }
}
