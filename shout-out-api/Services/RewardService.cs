using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Email;
using shout_out_api.Dto.Reward;
using shout_out_api.Enums;
using shout_out_api.Helpers;
using shout_out_api.Model;

namespace shout_out_api.Services
{
    public class RewardService
    {
        private readonly Context _db;
        private readonly FileConverter _fileConverter;
        private readonly EmailService _emailService;

        public RewardService(Context db, FileConverter fileConverter, EmailService emailService)
        {
            _db = db;
            _fileConverter = fileConverter;
            _emailService = emailService;
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

                var userEmails = _db.Users.Where(u => !string.IsNullOrEmpty(u.Email) && u.VerifiedAt.HasValue).Select(u => u.Email).ToList();

                foreach(var userEmail in userEmails)
                {
                    EmailDto emailModel = new EmailDto()
                    {
                        ToEmailAddress = userEmail!,
                        Subject = EmailContants.NEW_ITEM_CREATED_SUBJECT(),
                        Body = EmailContants.NEW_ITEM_CREATED_BODY(newReward.Name)
                    };

                    _emailService.SendEmail(emailModel);
                }

                var rewardDto = newReward.ToRewardResultDto();

                return rewardDto;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<RewardDto> EditReward(int id, RewardCreateEditDto model)
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

                var rewardDto = reward.ToRewardResultDto();

                return rewardDto;
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
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var reward = await _db.Rewards.SingleOrDefaultAsync(r => r.Id == id);

                    if (reward == null)
                    {
                        throw new Exception("Reward not found");
                    }

                    var price = reward.Cost;

                    var buyerUser = await _db.Users.SingleOrDefaultAsync(u => u.Id == buyerUserId);
                    if (buyerUser == null)
                    {
                        throw new Exception("User not found");
                    }

                    if (price > buyerUser.PointToHave)
                    {
                        throw new Exception("Not enough balance");
                    }

                    var buyerUserNameToDisplay = !string.IsNullOrEmpty(buyerUser.UserName) ? buyerUser.UserName : buyerUser.FirstName + " " + buyerUser.LastName;

                    buyerUser.PointToHave = buyerUser.PointToHave - price;
                    _db.Update(buyerUser);
                    _db.SaveChanges();

                    var adminEmails = _db.Users.Where(u => !string.IsNullOrEmpty(u.Email) && u.VerifiedAt.HasValue && u.Role == Role.Admin).Select(u => u.Email).ToList();

                    foreach (var adminEmail in adminEmails)
                    {
                        EmailDto emailModel = new EmailDto()
                        {
                            ToEmailAddress = adminEmail!,
                            Subject = EmailContants.NEW_ITEM_CLAIM_EVENT_SUBJECT(),
                            Body = EmailContants.NEW_ITEM_CLAIM_EVENT_BODY(buyerUserNameToDisplay, reward.Name)
                        };

                        _emailService.SendEmail(emailModel);
                    }

                    transaction.Commit();

                    return buyerUser.PointToHave;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }
    }
}
