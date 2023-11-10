using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Email;
using shout_out_api.Dto.Notification;
using shout_out_api.Dto.Reward;
using shout_out_api.Enums;
using shout_out_api.Helpers;
using shout_out_api.Interfaces;
using shout_out_api.Model;
using shout_out_api.Model.Interfaces;

namespace shout_out_api.Services
{
    public class RewardService: IRewardService
    {
        private readonly Context _db;
        private readonly FileConverter _fileConverter;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;

        public RewardService(Context db, FileConverter fileConverter, IEmailService emailService, INotificationService notificationService)
        {
            _db = db;
            _fileConverter = fileConverter;
            _emailService = emailService;
            _notificationService = notificationService;
        }

        public async Task<IList<RewardDto>> GetRewards()
        {
            try
            {
                List<Reward> rewards = await _db.Rewards.OrderBy(r => r.Cost).ToListAsync();
                List<RewardDto> rewardsDto = rewards.ToRewardsResultDto();

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

                var userEmails = _db.Users
                    .Where(u => !string.IsNullOrEmpty(u.Email) && u.VerifiedAt != null)
                    .Select(u => u.Email)
                    .ToList();

                if (userEmails != null && userEmails.Any())
                {
                    EmailDto emailModel = new EmailDto()
                    {
                        ToEmailAddress = null,
                        Subject = EmailContants.NEW_ITEM_CREATED_SUBJECT(),
                        Body = EmailContants.NEW_ITEM_CREATED_BODY(newReward.Name)
                    };

                    _emailService.SendEmailToMultipleRecipients(userEmails!, emailModel);
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

                var relatedNotification = await _db.Notifications.Where(n => n.RewardId == id).ExecuteDeleteAsync();
                _db.SaveChanges();

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

                    var adminUsers = _db.Users
                        .Where(u => !string.IsNullOrEmpty(u.Email) && u.VerifiedAt != null && u.Role == Role.Admin)
                        .ToList();

                    if (adminUsers != null && adminUsers.Any())
                    {
                        EmailDto emailModel = new EmailDto()
                        {
                            ToEmailAddress = null,
                            Subject = EmailContants.NEW_ITEM_CLAIM_EVENT_SUBJECT(),
                            Body = EmailContants.NEW_ITEM_CLAIM_EVENT_BODY(buyerUserNameToDisplay, reward.Name)
                        };

                        var adminUserEmails = adminUsers.Select(admin => admin.Email).ToList();

                        _emailService.SendEmailToMultipleRecipients(adminUserEmails!, emailModel);


                    }

                    foreach (var adminUser in adminUsers!)
                    {
                        CreateNotificationItemDto notificationItemDto = new CreateNotificationItemDto()
                        {
                            EventType = NotificationEventType.RewardClaimed,
                            ReceiverUserId = adminUser.Id,
                            SenderUserId = buyerUserId,
                            RewardId = reward.Id
                        };

                        await _notificationService.CreateNotificationAsync(notificationItemDto);
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

        public async Task<List<RewardDto>> GetMostPopularRewards()
        {
            DateTime now = DateTime.Now;

            var mostPopularRewards = await _db.Notifications
                .Where(n =>
                    n.EventType == (int)NotificationEventType.RewardClaimed &&
                    n.RewardId.HasValue &&
                    n.DateTime >= now.AddMonths(-1))
                .GroupBy(n => n.RewardId)
                .Select(group => new
                {
                    Entity = group.First().Reward,
                    Count = group.Count()
                })
                .OrderByDescending(n => n.Count)
                .Take(5)
                .ToListAsync();

            List<RewardDto> rewardsDto = new List<RewardDto>();

            foreach(var reward in mostPopularRewards)
            {
                var rewardDto = new RewardDto()
                {
                    Id = reward.Entity.Id,
                    Description = reward.Entity.Description,
                    Name = reward.Entity.Name,
                    Cost = reward.Entity.Cost,
                };

                if (reward.Entity.Avatar != null)
                {
                    var imageBase64string = Convert.ToBase64String(reward.Entity.Avatar);
                    var fileTpye = "jpg";
                    var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                    rewardDto.Avatar = source;
                }

                rewardsDto.Add(rewardDto);
            }

            return rewardsDto;
        }
    }
}
