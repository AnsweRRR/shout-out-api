using GiphyApiWrapper;
using GiphyApiWrapper.Models;
using GiphyApiWrapper.Models.Parameters;
using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Notification;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Enums;
using shout_out_api.Helpers;
using shout_out_api.Interfaces;
using shout_out_api.Model;

namespace shout_out_api.Services
{
    public class PointSystemService: IPointSystemService
    {
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;
        private readonly INotificationService _notificationService;

        public PointSystemService(Context db, ConfigHelper configHelper, INotificationService notificationService)
        {
            _db = db;
            _configHelper = configHelper;
            _notificationService = notificationService;
        }

        public async Task<IList<FeedItem>> GetHistory(int take = 10, int offset = 0)
        {
            try
            {
                List<FeedItem> feedItems = await _db.PointHistories
                    .Join(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phru) => new { PointHistory = ph, ReceiverUser = phru })
                    .GroupBy(fi => fi.PointHistory.Id)
                    .Select(group => new FeedItem()
                    {
                        Id = group.Key,
                        Amount = group.First().PointHistory.Amount,
                        SenderId = group.First().PointHistory.SenderId,
                        SenderName = !string.IsNullOrEmpty(group.First().PointHistory.SenderUser.UserName)
                            ? group.First().PointHistory.SenderUser.UserName
                            : group.First().PointHistory.SenderUser.FirstName + " " + group.First().PointHistory.SenderUser.LastName,
                        SenderAvatar = group.First().PointHistory.SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(group.First().PointHistory.SenderUser.Avatar)}" : null,
                        EventDate = group.First().PointHistory.EventDate,
                        Description = group.First().PointHistory.Description,
                        EventType = group.First().PointHistory.EventType,
                        GiphyGif = !string.IsNullOrEmpty(group.First().PointHistory.GiphyGifUrl)
                            ? group.First().PointHistory.GiphyGifUrl
                            : null,
                        ReceiverUsers = group.Select(fi => new ReceiverUsers()
                        {
                            UserId = fi.ReceiverUser.Id,
                            UserName = !string.IsNullOrEmpty(fi.ReceiverUser.User.UserName)
                                ? fi.ReceiverUser.User.UserName
                                : fi.ReceiverUser.User.FirstName + " " + fi.ReceiverUser.User.LastName,
                            UserAvatar = fi.ReceiverUser.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.ReceiverUser.User.Avatar)}" : null,
                        }).ToList()
                    })
                    .OrderByDescending(fi => fi.EventDate)
                    .Skip(offset)
                    .Take(take)
                    .ToListAsync();

                return feedItems;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<GivePointsResultDto> GivePoints(int senderUserId, GivePointsDto model)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    DateTime now = DateTime.Now;

                    var senderUser = await _db.Users.SingleOrDefaultAsync(u => u.Id == senderUserId);

                    if (senderUser == null)
                    {
                        throw new Exception("Unathorized user");
                    }

                    var distinctedReceiverUsers = model.ReceiverUsers.Distinct().ToList();

                    if (senderUser.PointsToGive < (distinctedReceiverUsers.Count() * model.Amount))
                    {
                        throw new Exception("Operation not allowed. You do not have enough points!");
                    }

                    senderUser.PointsToGive = senderUser.PointsToGive - (distinctedReceiverUsers.Count() * model.Amount);

                    _db.Users.Update(senderUser);
                    _db.SaveChanges();

                    if (distinctedReceiverUsers.Contains(senderUserId))
                    {
                        throw new Exception("Operation not allowed. You can not give points to yourself!");
                    }

                    List<User> users = await _db.Users.Where(u => distinctedReceiverUsers.Contains(u.Id)).ToListAsync();

                    if (users == null || !users.Any())
                    {
                        throw new Exception("No users found");
                    }

                    string? description = model.HashTags.Any() ? string.Join(" ", model.HashTags) : null;

                    PointHistory pointEvent = new PointHistory()
                    {
                        Amount = model.Amount,
                        GiphyGifUrl = model.GiphyGifUrl,
                        Description = description,
                        SenderId = senderUserId,
                        EventDate = now,
                        EventType = PointEventType.UserEvent
                    };

                    _db.PointHistories.Add(pointEvent);
                    _db.SaveChanges();

                    List<PointHistory_ReceiverUser> pointHistory_ReceiverUser = new List<PointHistory_ReceiverUser>();

                    foreach (User user in users)
                    {
                        PointHistory_ReceiverUser receiverUsers = new PointHistory_ReceiverUser()
                        {
                            User = user,
                            PointHistory = pointEvent
                        };

                        pointHistory_ReceiverUser.Add(receiverUsers);

                        CreateNotificationItemDto notificationItemDto = new CreateNotificationItemDto()
                        {
                            PointAmount = model.Amount,
                            EventType = NotificationEventType.GetPointsByUser,
                            ReceiverUserId = user.Id,
                            SenderUserId = senderUserId
                        };

                        var notificationToCreate = new Notification()
                        {
                            DateTime = DateTime.Now,
                            PointAmount = notificationItemDto.PointAmount,
                            EventType = (int)notificationItemDto.EventType,
                            SenderUserId = notificationItemDto.SenderUserId,
                            ReceiverUser = user,
                            RewardId = notificationItemDto.RewardId,
                            IsRead = false
                        };

                        _db.Notifications.Add(notificationToCreate);
                        _db.SaveChanges();
                    }

                    _db.PointHistory_ReceiverUsers.AddRange(pointHistory_ReceiverUser);
                    _db.SaveChanges();

                    GivePointsResultDto givePointsResultDto = new GivePointsResultDto()
                    {
                        Id = pointEvent.Id,
                        Amount = pointEvent.Amount,
                        Description = pointEvent.Description,
                        SenderId = pointEvent.SenderId,
                        SenderName = !string.IsNullOrEmpty(pointEvent.SenderUser.UserName)
                            ? pointEvent.SenderUser.UserName
                            : pointEvent.SenderUser.FirstName + " " + pointEvent.SenderUser.LastName,
                        SenderAvatar = pointEvent.SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(pointEvent.SenderUser.Avatar)}" : null,
                        EventDate = pointEvent.EventDate,
                        EventType = pointEvent.EventType,
                        GiphyGif = pointEvent.GiphyGifUrl,
                        PointsToGiveAfterSend = senderUser.PointsToGive,
                        ReceiverUsers = users.Select(ru => new ReceiverUsers()
                        {
                            UserId = ru.Id,
                            UserName = !string.IsNullOrEmpty(ru.UserName)
                                ? ru.UserName
                                : ru.FirstName + " " + ru.LastName,
                            UserAvatar = ru.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(ru.Avatar)}" : null,
                        }).ToList()
                    };

                    transaction.Commit();

                    return givePointsResultDto;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public async Task ScheduledTask()
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    DateTime now = DateTime.Now;
                    int birthDayPointAmount = 50;
                    int joinToCompanyPointAmount = 50;

                    List<User> users = await _db.Users.Where(u => u.VerifiedAt.HasValue && (u.Birthday.HasValue || u.StartAtCompany.HasValue)).ToListAsync();

                    foreach (var user in users)
                    {
                        if (user.Birthday.HasValue && user.Birthday.Value.Date == now.Date)
                        {
                            PointHistory pointEvent = new PointHistory()
                            {
                                Amount = birthDayPointAmount,
                                Description = "Happy birthday!",
                                SenderId = null,
                                EventDate = now,
                                EventType = PointEventType.BirthdayEvent,
                                GiphyGifUrl = "https://media2.giphy.com/media/qnWjDNWHm9Wy1zLwG8/giphy.gif"
                            };

                            _db.PointHistories.Add(pointEvent);
                            _db.SaveChanges();

                            var receiverUser = new PointHistory_ReceiverUser()
                            {
                                User = user,
                                PointHistory = pointEvent
                            };

                            _db.PointHistory_ReceiverUsers.Add(receiverUser);
                            _db.SaveChanges();

                            var notificationToCreate = new Notification()
                            {
                                DateTime = now,
                                PointAmount = joinToCompanyPointAmount,
                                EventType = (int)NotificationEventType.GetPointsByBirthday,
                                ReceiverUser = user
                            };

                            user.PointToHave += birthDayPointAmount;

                            _db.Notifications.Add(notificationToCreate);
                            _db.SaveChanges();
                        }

                        if (user.StartAtCompany.HasValue && user.StartAtCompany.Value.Date == now.Date)
                        {
                            PointHistory pointEvent = new PointHistory()
                            {
                                Amount = joinToCompanyPointAmount,
                                Description = "Happy work anniversary!",
                                SenderId = null,
                                EventDate = now,
                                EventType = PointEventType.JoinToCompanyEvent,
                                GiphyGifUrl = "https://media3.giphy.com/media/lNA3pbJxd2nmuMcOvH/giphy.gif"
                            };

                            _db.PointHistories.Add(pointEvent);
                            _db.SaveChanges();

                            var receiverUser = new PointHistory_ReceiverUser()
                            {
                                User = user,
                                PointHistory = pointEvent
                            };

                            _db.PointHistory_ReceiverUsers.Add(receiverUser);
                            _db.SaveChanges();

                            var notificationToCreate = new Notification()
                            {
                                DateTime = now,
                                PointAmount = joinToCompanyPointAmount,
                                EventType = (int)NotificationEventType.GetPointsByJoinDate,
                                ReceiverUser = user
                            };

                            user.PointToHave += joinToCompanyPointAmount;

                            _db.Notifications.Add(notificationToCreate);
                            _db.SaveChanges();
                        }

                        if (now.Day == 1) //new month
                        {
                            user.PointsToGive = 100;
                        }
                    }

                    _db.Users.UpdateRange(users);
                    _db.SaveChanges();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public async Task<RootObject> GetGiphyGifs(int limit, int offset, string? filterName = null)
        {
            var giphy = new Giphy(_configHelper.Giphy.ApiKey);

            RootObject result;

            if (string.IsNullOrEmpty(filterName))
            {
                var parameter = new TrendingParameter() { Limit = limit, Offset = offset, Rating = Rating.G };
                result = await giphy.Trending(parameter);
            }
            else
            {
                var parameter = new SearchParameter() { Query = filterName, Limit = limit, Offset = offset, Rating = Rating.G };
                result = await giphy.Search(parameter);
            }

            return result;
        }
    }
}
