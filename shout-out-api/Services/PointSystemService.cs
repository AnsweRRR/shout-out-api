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
        private readonly ILogger _logger;
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;
        private readonly INotificationService _notificationService;

        public PointSystemService(ILogger logger, Context db, ConfigHelper configHelper, INotificationService notificationService)
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
                List<FeedItem> feedItems = await _db.PointHistories
                    .GroupBy(feedItem => feedItem.Id)
                    .Select(group => new FeedItem()
                    {
                        Id = group.Key,
                        Amount = group.First().Amount,
                        SenderId = group.First().SenderId,
                        SenderName = !string.IsNullOrEmpty(group.First().SenderUser.UserName)
                            ? group.First().SenderUser.UserName
                            : group.First().SenderUser.FirstName + " " + group.First().SenderUser.LastName,
                        SenderAvatar = group.First().SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(group.First().SenderUser.Avatar)}" : null,
                        EventDate = group.First().EventDate,
                        Description = group.First().Description,
                        EventType = group.First().EventType,
                        GiphyGif = !string.IsNullOrEmpty(group.First().GiphyGifUrl)
                            ? group.First().GiphyGifUrl
                            : null,
                        ReceiverUsers = _db.PointHistory_ReceiverUsers
                            .Where(phru => phru.PointHistoryId == group.Key)
                            .Select(phru => new ReceiverUsers()
                            {
                                UserId = phru.UserId,
                                UserName = !string.IsNullOrEmpty(phru.User.UserName)
                                ? phru.User.UserName
                                : phru.User.FirstName + " " + phru.User.LastName,
                                UserAvatar = phru.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(phru.User.Avatar)}" : null,
                            })
                            .ToList(),
                        Comments = _db.Comments
                            .Where(c => c.PointHistoryId == group.Key)
                            .Select(fi => new CommentDto()
                            {
                                Id = fi.Id,
                                Text = fi.Text,
                                GiphyGif = fi.GiphyGifUrl,
                                PointHistoryId = fi.PointHistoryId,
                                CreateDate = fi.CreateDate,
                                EditDate = fi.EditDate,
                                SenderId = fi.UserId,
                                SenderAvatar = fi.User.Avatar != null
                                                    ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.User.Avatar)}"
                                                    : null,
                                SenderName = !string.IsNullOrEmpty(fi.User.UserName)
                                                    ? fi.User.UserName
                                                    : fi.User.FirstName + " " + fi.User.LastName
                            })
                            .OrderByDescending(c => c.CreateDate)
                            .ToList(),
                        Likes = _db.Likes
                            .Where(l => l.PointHistoryId == group.Key)
                            .Select(fi => new LikeDto()
                            {
                                Id = fi.Id,
                                LikedById = fi.UserId,
                                LikedByName = !string.IsNullOrEmpty(fi.User.UserName)
                                    ? fi.User.UserName
                                    : fi.User.FirstName + " " + fi.User.LastName
                            })
                            .ToList(),
                        IsLikedByCurrentUser = _db.Likes.Any(l => l.PointHistoryId == group.Key && l.UserId == userId)
                    })
                    .OrderByDescending(ph => ph.EventDate)
                    .Skip(offset)
                    .Take(take)
                    .ToListAsync(cancellationToken);

                #region old query
                //List<FeedItem> feedItems = await _db.PointHistories
                //    .Join(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phru) => new { PointHistory = ph, ReceiverUser = phru })
                //    .GroupJoin(_db.Likes, phrul => phrul.PointHistory.Id, like => like.PointHistoryId, (phrul, likes) => new { phrul, Likes = likes })
                //    .SelectMany(result => result.Likes.DefaultIfEmpty(), (result, like) => new { result.phrul, Like = like })
                //    .GroupJoin(_db.Comments, phrul => phrul.phrul.PointHistory.Id, comment => comment.PointHistoryId, (phrul, comments) => new { phrul, Comments = comments })
                //    .SelectMany(result => result.Comments.DefaultIfEmpty(), (result, comment) => new { result.phrul, Comment = comment })
                //    .GroupBy(fi => fi.phrul.phrul.PointHistory.Id)
                //    .Select(group => new FeedItem()
                //    {
                //        Id = group.Key,
                //        Amount = group.First().phrul.phrul.PointHistory.Amount,
                //        SenderId = group.First().phrul.phrul.PointHistory.SenderId,
                //        SenderName = !string.IsNullOrEmpty(group.First().phrul.phrul.PointHistory.SenderUser.UserName)
                //            ? group.First().phrul.phrul.PointHistory.SenderUser.UserName
                //            : group.First().phrul.phrul.PointHistory.SenderUser.FirstName + " " + group.First().phrul.phrul.PointHistory.SenderUser.LastName,
                //        SenderAvatar = group.First().phrul.phrul.PointHistory.SenderUser.Avatar != null
                //            ? $"data:image/jpg;base64,{Convert.ToBase64String(group.First().phrul.phrul.PointHistory.SenderUser.Avatar)}" : null,
                //        EventDate = group.First().phrul.phrul.PointHistory.EventDate,
                //        Description = group.First().phrul.phrul.PointHistory.Description,
                //        EventType = group.First().phrul.phrul.PointHistory.EventType,
                //        GiphyGif = !string.IsNullOrEmpty(group.First().phrul.phrul.PointHistory.GiphyGifUrl)
                //            ? group.First().phrul.phrul.PointHistory.GiphyGifUrl
                //            : null,
                //        ReceiverUsers = group.Where(fi => fi.phrul.phrul.ReceiverUser != null).Select(fi => new ReceiverUsers()
                //        {
                //            UserId = fi.phrul.phrul.ReceiverUser.Id,
                //            UserName = !string.IsNullOrEmpty(fi.phrul.phrul.ReceiverUser.User.UserName)
                //                ? fi.phrul.phrul.ReceiverUser.User.UserName
                //                : fi.phrul.phrul.ReceiverUser.User.FirstName + " " + fi.phrul.phrul.ReceiverUser.User.LastName,
                //            UserAvatar = fi.phrul.phrul.ReceiverUser.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.phrul.phrul.ReceiverUser.User.Avatar)}" : null,
                //        }).ToList(),
                //        Likes = group.Where(fi => fi.phrul.Like != null).Select(fi => new LikeDto()
                //        {
                //            Id = fi.phrul.Like!.Id,
                //            LikedById = fi.phrul.Like.UserId,
                //            LikedByName = !string.IsNullOrEmpty(fi.phrul.Like.User.UserName)
                //                ? fi.phrul.Like.User.UserName
                //                : fi.phrul.Like.User.FirstName + " " + fi.phrul.Like.User.LastName
                //        }).ToList(),
                //        IsLikedByCurrentUser = group.Where(n => n.phrul.Like != null).Any(n => n.phrul.Like!.User.Id == userId),
                //        Comments = group.Where(fi => fi.Comment != null).Select(fi => new CommentDto()
                //        {
                //            Id = fi.Comment!.Id,
                //            Text = fi.Comment.Text,
                //            GiphyGif = fi.Comment.GiphyGifUrl,
                //            PointHistoryId = fi.Comment.PointHistoryId,
                //            CreateDate = fi.Comment.CreateDate,
                //            EditDate = fi.Comment.EditDate,
                //            SenderId = fi.Comment.UserId,
                //            SenderAvatar = fi.Comment.User.Avatar != null
                //                                ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.Comment.User.Avatar)}"
                //                                : null,
                //            SenderName = !string.IsNullOrEmpty(fi.Comment.User.UserName)
                //                                ? fi.Comment.User.UserName
                //                                : fi.Comment.User.FirstName + " " + fi.Comment.User.LastName
                //        }).OrderByDescending(c => c.CreateDate).ToList()
                //    })
                //    .OrderByDescending(fi => fi.EventDate)
                //    .Skip(offset)
                //    .Take(take)
                //    .ToListAsync();
                #endregion

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

        public async Task Like(int userId, int feedItemId)
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

                var like = new Like()
                {
                    PointHistory = feedItem,
                    User = user
                };

                _db.Likes.Add(like);
                _db.SaveChanges();
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task Dislike(int userId, int feedItemId)
        {
            try
            {
                var like = await _db.Likes.FirstOrDefaultAsync(fi => fi.PointHistoryId == feedItemId && fi.UserId == userId);

                if (like == null)
                {
                    throw new Exception("You did not like this post before.");
                }

                _db.Likes.Remove(like);
                _db.SaveChanges();
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

        public async Task DeleteComment(int userId, int commentId)
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

                _db.Comments.Remove(comment);
                _db.SaveChanges();
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
