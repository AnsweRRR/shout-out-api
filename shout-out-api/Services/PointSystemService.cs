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
                    .Join(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phru) => new { PointHistory = ph, ReceiverUsers = phru })
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
                            UserId = fi.ReceiverUsers.Id,
                            UserName = !string.IsNullOrEmpty(fi.ReceiverUsers.User.UserName)
                                ? fi.ReceiverUsers.User.UserName
                                : fi.ReceiverUsers.User.FirstName + " " + fi.ReceiverUsers.User.LastName,
                            UserAvatar = fi.ReceiverUsers.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.ReceiverUsers.User.Avatar)}" : null,
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

        public async Task GivePoints(int senderUserId, GivePointsDto model)
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

                    senderUser.PointsToGive = senderUser.PointsToGive - (model.ReceiverUsers.Count() * model.Amount);

                    _db.Users.Update(senderUser);
                    _db.SaveChanges();

                    List<User> users = await _db.Users.Where(u => model.ReceiverUsers.Contains(u.Id)).ToListAsync();

                    if (users == null || !users.Any())
                    {
                        throw new Exception("No users found");
                    }

                    PointHistory pointEvent = new PointHistory()
                    {
                        Amount = model.Amount,
                        Description = model.Description,
                        SenderId = senderUserId,
                        EventDate = now,
                        EventType = PointEventType.UserEvent
                    };

                    _db.PointHistories.Add(pointEvent);
                    _db.SaveChanges();

                    List<PointHistory_ReceiverUser> pointHistory_ReceiverUser = new List<PointHistory_ReceiverUser>();

                    foreach (User user in users)
                    {
                        if (user.Id != senderUserId)
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

                            await _notificationService.CreateNotificationAsync(notificationItemDto);
                        }
                    }

                    _db.PointHistory_ReceiverUsers.AddRange(pointHistory_ReceiverUser);
                    _db.SaveChanges();

                    transaction.Commit();
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
