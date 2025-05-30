﻿using Microsoft.EntityFrameworkCore;
using ShoutOut.DataAccess;
using ShoutOut.Dto.Email;
using ShoutOut.Dto.Notification;
using ShoutOut.Dto.Reward;
using ShoutOut.Dto.User;
using ShoutOut.Enums;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;
using ShoutOut.Model;
using ShoutOut.Model.Interfaces;

namespace ShoutOut.Services
{
    public class RewardService: IRewardService
    {
        private readonly Context _db;
        private readonly FileConverter _fileConverter;
        private readonly IEmailService _emailService;
        private readonly EmailTemplates _emailTemplates;
        private readonly INotificationService _notificationService;

        public RewardService(Context db, FileConverter fileConverter, IEmailService emailService, EmailTemplates emailTemplates, INotificationService notificationService)
        {
            _db = db;
            _fileConverter = fileConverter;
            _emailService = emailService;
            _emailTemplates = emailTemplates;
            _notificationService = notificationService;
        }

        public async Task<IList<RewardDto>> GetRewards(CancellationToken cancellationToken)
        {
            try
            {
                List<Reward> rewards = await _db.Rewards.OrderBy(r => r.Cost).ToListAsync(cancellationToken);
                List<RewardDto> rewardsDto = rewards.ToRewardsResultDto();

                return rewardsDto;
            }
            catch (Exception)
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
                    string itemImageSrc = string.Empty;
                    if (newReward.Avatar != null)
                    {
                        var imageBase64string = Convert.ToBase64String(newReward.Avatar);
                        var fileTpye = "jpg";
                        var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                        itemImageSrc = source;
                    }

                    EmailDto emailModel = new EmailDto()
                    {
                        ToEmailAddress = null,
                        Subject = _emailTemplates.NEW_ITEM_CREATED_SUBJECT(),
                        Body = _emailTemplates.NEW_ITEM_CREATED_BODY(newReward.Name, itemImageSrc)
                    };

                    _emailService.SendEmailToMultipleRecipients(userEmails!, emailModel);
                }

                var rewardDto = newReward.ToRewardResultDto();

                return rewardDto;
            }
            catch(Exception)
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
            catch (Exception)
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
            catch(Exception)
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
                        string itemImageSrc = string.Empty;
                        if (reward.Avatar != null)
                        {
                            var imageBase64string = Convert.ToBase64String(reward.Avatar);
                            var fileTpye = "jpg";
                            var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                            itemImageSrc = source;
                        }

                        EmailDto emailModel = new EmailDto()
                        {
                            ToEmailAddress = null,
                            Subject = _emailTemplates.NEW_ITEM_CLAIM_EVENT_SUBJECT(),
                            Body = _emailTemplates.NEW_ITEM_CLAIM_EVENT_BODY(buyerUserNameToDisplay, reward.Name, itemImageSrc)
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
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public async Task<List<RewardDto>> GetMostPopularRewards(CancellationToken cancellationToken)
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
                .ToListAsync(cancellationToken);

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
