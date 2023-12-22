using GiphyApiWrapper;
using GiphyApiWrapper.Models;
using GiphyApiWrapper.Models.Parameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShoutOut.DataAccess;
using ShoutOut.Dto.Notification;
using ShoutOut.Dto.PointSystem;
using ShoutOut.Enums;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;
using ShoutOut.Model;

namespace ShoutOut.Services
{
    public class PointSystemService: IPointSystemService
    {
        private readonly ILogger<IPointSystemService> _logger;
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;
        private readonly INotificationService _notificationService;

        public PointSystemService(ILogger<IPointSystemService> logger, Context db, ConfigHelper configHelper, INotificationService notificationService)
        {
            _logger = logger;
            _db = db;
            _configHelper = configHelper;
            _notificationService = notificationService;
        }

        public async Task<IList<FeedItem>> GetHistory(int userId, CancellationToken cancellationToken, int take = 10, int offset = 0)
        {
            try
            {
                List<FeedItem> feedItems = await
                    (from feedItem in _db.PointHistories
                     join receiverUser in _db.PointHistory_ReceiverUsers on feedItem.Id
                     equals receiverUser.PointHistoryId into receiverUsersGroup
                     from receiverUser in receiverUsersGroup.DefaultIfEmpty()
                     join like in _db.Likes on feedItem.Id
                     equals like.PointHistoryId into likesGroup
                     from like in likesGroup.DefaultIfEmpty()
                     join comment in _db.Comments on feedItem.Id
                     equals comment.PointHistoryId into commentsGroup
                     from comment in commentsGroup.DefaultIfEmpty()
                     group new { receiverUser, like, comment, feedItem } by feedItem.Id into groupedData
                     orderby groupedData.First().feedItem.EventDate descending
                     select new FeedItem()
                     {
                         Id = groupedData.Key,
                         Amount = groupedData.First().feedItem.Amount,
                         EventDate = groupedData.First().feedItem.EventDate,
                         Description = groupedData.First().feedItem.Description,
                         EventType = groupedData.First().feedItem.EventType,
                         GiphyGif = !string.IsNullOrEmpty(groupedData.First().feedItem.GiphyGifUrl)
                             ? groupedData.First().feedItem.GiphyGifUrl
                             : null,
                         SenderId = groupedData.First().feedItem.SenderId,
                         SenderName = !string.IsNullOrEmpty(groupedData.First().feedItem.SenderUser.UserName)
                             ? groupedData.First().feedItem.SenderUser.UserName
                             : groupedData.First().feedItem.SenderUser.FirstName + " " + groupedData.First().feedItem.SenderUser.LastName,
                         SenderAvatar = groupedData.First().feedItem.SenderUser.Avatar != null
                             ? $"data:image/jpg;base64,{Convert.ToBase64String(groupedData.First().feedItem.SenderUser.Avatar)}" : null,

                         IsLikedByCurrentUser = groupedData.Any(x => x.like != null && x.feedItem.Id == groupedData.Key && x.like.UserId == userId),

                         ReceiverUsers = groupedData.Where(x => x.receiverUser != null).Select(x => new ReceiverUsers()
                         {
                             UserId = x.receiverUser.UserId,
                             UserName = !string.IsNullOrEmpty(x.receiverUser.User.UserName)
                                         ? x.receiverUser.User.UserName
                                         : x.receiverUser.User.FirstName + " " + x.receiverUser.User.LastName,
                             UserAvatar = x.receiverUser.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(x.receiverUser.User.Avatar)}" : null,
                         }).ToList(),

                         Likes = groupedData.Where(x => x.like != null).Select(x => new LikeDto()
                         {
                             Id = x.like.Id,
                             LikedById = x.like.UserId,
                             LikedByName = !string.IsNullOrEmpty(x.like.User.UserName)
                                 ? x.like.User.UserName
                                 : x.like.User.FirstName + " " + x.like.User.LastName
                         }).ToList(),

                         Comments = groupedData.Where(x => x.comment != null).Select(x => new CommentDto()
                         {
                             Id = x.comment.Id,
                             Text = x.comment.Text,
                             GiphyGif = x.comment.GiphyGifUrl,
                             PointHistoryId = x.comment.PointHistoryId,
                             CreateDate = x.comment.CreateDate,
                             EditDate = x.comment.EditDate,
                             SenderId = x.comment.UserId,
                             SenderName = !string.IsNullOrEmpty(x.comment.User.UserName)
                                 ? x.comment.User.UserName
                                 : x.comment.User.FirstName + " " + x.comment.User.LastName,
                             SenderAvatar = x.comment.User.Avatar != null
                                 ? $"data:image/jpg;base64,{Convert.ToBase64String(x.comment.User.Avatar)}"
                                 : null,
                         }).OrderByDescending(x => x.CreateDate).ToList(),
                     })
                    .Skip(offset)
                    .Take(take)
                    .ToListAsync(cancellationToken);

                return feedItems;
            }
            catch (Exception)
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

                        await _notificationService.CreateNotificationAsync(notificationItemDto);
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
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public async Task<LikeDislikeResultDto> Like(int userId, int feedItemId)
        {
            try
            {
                var feedItem = await _db.PointHistories.FirstOrDefaultAsync(fi => fi.Id == feedItemId);

                if (feedItem == null)
                {
                    throw new Exception("This feedItem is not exist");
                }

                bool isLikeAlreadyExist = await _db.Likes.AnyAsync(l => l.PointHistoryId == feedItemId && l.UserId == userId);

                if (isLikeAlreadyExist)
                {
                    throw new Exception("You already liked this post.");
                }

                var user = await _db.Users.FirstAsync(u => u.Id == userId);
                var userResultDto = user.ToUserResultDto();

                var like = new Like()
                {
                    PointHistory = feedItem,
                    User = user,
                };

                LikeDislikeResultDto likeDislikeResultDto = new LikeDislikeResultDto()
                {
                    PointHistoryId = feedItemId,
                    LikedById = userId,
                    LikedByName = userResultDto.Display
                };

                _db.Likes.Add(like);
                _db.SaveChanges();

                return likeDislikeResultDto;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<LikeDislikeResultDto> Dislike(int userId, int feedItemId)
        {
            try
            {
                var like = await _db.Likes.FirstOrDefaultAsync(fi => fi.PointHistoryId == feedItemId && fi.UserId == userId);

                if (like == null)
                {
                    throw new Exception("You did not like this post before.");
                }

                var user = await _db.Users.FirstAsync(u => u.Id == userId);
                var userResultDto = user.ToUserResultDto();

                LikeDislikeResultDto likeDislikeResultDto = new LikeDislikeResultDto()
                {
                    PointHistoryId = feedItemId,
                    LikedById = userId,
                    LikedByName = userResultDto.Display
                };

                _db.Likes.Remove(like);
                _db.SaveChanges();

                return likeDislikeResultDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<CommentDto> AddComment(int userId, CommentDto model)
        {
            try
            {
                var user = await _db.Users.FirstAsync(u => u.Id == userId);

                var commentToCreate = new Comment
                {
                    Text = model.Text,
                    GiphyGifUrl = model.GiphyGif,
                    PointHistoryId = model.PointHistoryId,
                    CreateDate = DateTime.Now,
                    User = user
                };

                _db.Comments.Add(commentToCreate);
                _db.SaveChanges();

                return commentToCreate.ToCommentResultDto();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<CommentDto> EditComment(int userId, int commentId, CommentDto model)
        {
            try
            {
                var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
                var user = _db.Users.Single(u => u.Id == userId);

                if (comment == null)
                {
                    throw new Exception("Comment is not found");
                }

                if (comment.UserId != userId)
                {
                    throw new Exception("You can not edit someone else's comment.");
                }

                comment.EditDate = DateTime.Now;
                comment.Text = model.Text;
                comment.GiphyGifUrl = model.GiphyGif;
                comment.User = user;

                _db.Comments.Update(comment);
                _db.SaveChanges();

                return comment.ToCommentResultDto();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<DeleteCommentResultDto> DeleteComment(int userId, int commentId)
        {
            try
            {
                var comment = await _db.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

                if (comment == null)
                {
                    throw new Exception("Comment is not found");
                }

                if (comment.UserId != userId)
                {
                    throw new Exception("You can not delete someone else's comment.");
                }

                DeleteCommentResultDto deleteCommentResultDto = new DeleteCommentResultDto()
                {
                    Id = comment.Id,
                    PointHistoryId = comment.PointHistoryId
                };

                _db.Comments.Remove(comment);
                _db.SaveChanges();

                return deleteCommentResultDto;
            }
            catch (Exception)
            {
                throw;
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

                    List<User> users = await _db.Users.Where(u => u.IsActive && u.VerifiedAt.HasValue && (u.Birthday.HasValue || u.StartAtCompany.HasValue)).ToListAsync();

                    bool isWorkerAlreadyRanToday = await _db.PointHistory_ReceiverUsers
                        .Where(x =>
                            x.PointHistory.EventDate.Date == now.Date &&
                            (x.PointHistory.EventType == PointEventType.BirthdayEvent || x.PointHistory.EventType == PointEventType.JoinToCompanyEvent))
                        .AnyAsync();

                    if (!isWorkerAlreadyRanToday)
                    {
                        foreach (var user in users)
                        {
                            if (user.Birthday.HasValue && user.Birthday.Value.Date == now.Date && user.IsActive && user.VerifiedAt != null)
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

                            if (user.StartAtCompany.HasValue && user.StartAtCompany.Value.Date == now.Date && user.IsActive && user.VerifiedAt != null)
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
                    }

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message);
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
