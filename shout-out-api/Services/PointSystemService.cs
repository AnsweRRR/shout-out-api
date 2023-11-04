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

        public async Task<IList<FeedItem>> GetHistory(int userId, int take = 10, int offset = 0)
        {
            //try
            //{
            //    var feedItems = await _db.PointHistories
            //    .GroupJoin(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phruGroup) => new { ph, phruGroup })
            //    .SelectMany(result => result.phruGroup.DefaultIfEmpty(), (result, phru) => new { result.ph, phru })
            //    .GroupJoin(_db.Likes, result => result.ph.Id, like => like.PointHistoryId, (result, likeGroup) => new { result.ph, result.phru, likeGroup })
            //    .SelectMany(result => result.likeGroup.DefaultIfEmpty(), (result, like) => new { result.ph, result.phru, like })
            //    .GroupJoin(_db.Comments, result => result.ph.Id, comment => comment.PointHistoryId, (result, commentGroup) => new { result.ph, result.phru, result.like, commentGroup })
            //    .SelectMany(result => result.commentGroup.DefaultIfEmpty(), (result, comment) => new { result.ph, result.phru, result.like, comment })
            //    .GroupBy(result => result.ph.Id)
            //    .Select(group => new FeedItem
            //    {
            //        Id = group.Key,
            //        Amount = group.First().ph.Amount,
            //        SenderId = group.First().ph.SenderId,
            //        SenderName = !string.IsNullOrEmpty(group.First().ph.SenderUser.UserName)
            //            ? group.First().ph.SenderUser.UserName
            //            : group.First().ph.SenderUser.FirstName + " " + group.First().ph.SenderUser.LastName,
            //        SenderAvatar = group.First().ph.SenderUser.Avatar != null
            //            ? $"data:image/jpg;base64,{Convert.ToBase64String(group.First().ph.SenderUser.Avatar)}"
            //            : null,
            //        EventDate = group.First().ph.EventDate,
            //        Description = group.First().ph.Description,
            //        EventType = group.First().ph.EventType,
            //        GiphyGif = !string.IsNullOrEmpty(group.First().ph.GiphyGifUrl)
            //            ? group.First().ph.GiphyGifUrl
            //            : null,
            //        IsLikedByCurrentUser = group.Where(result => result.like != null).Any(n => n.like!.User.Id == userId),

            //        ReceiverUsers = group
            //            .Where(result => result.phru != null)
            //            .Select(result => new ReceiverUsers
            //            {
            //                UserId = result.phru.UserId,
            //                UserName = !string.IsNullOrEmpty(result.phru.User.UserName)
            //                    ? result.phru.User.UserName
            //                    : result.phru.User.FirstName + " " + result.phru.User.LastName,
            //                UserAvatar = result.phru.User.Avatar != null
            //                    ? $"data:image/jpg;base64,{Convert.ToBase64String(result.phru.User.Avatar)}" 
            //                    : null,
            //            })
            //            .ToList(),

            //        Likes = group
            //            .Where(result => result.like != null)
            //            .Select(result => new LikeDto
            //            {
            //                Id = result.like!.Id,
            //                LikedById = result.like.UserId,
            //                LikedByName = !string.IsNullOrEmpty(result.like.User.UserName)
            //                    ? result.like.User.UserName
            //                    : result.like.User.FirstName + " " + result.like.User.LastName
            //            })
            //            .ToList(),

            //        Comments = group
            //            .Where(result => result.comment != null)
            //            .Select(result => new CommentDto
            //            {
            //                Id = result.comment!.Id,
            //                Text = result.comment.Text,
            //                GiphyGifUrl = result.comment.GiphyGifUrl,
            //                PointHistoryId = result.comment.PointHistoryId,
            //                CreateDate = result.comment.CreateDate,
            //                EditDate = result.comment.EditDate,
            //                SenderId = result.comment.UserId,
            //                SenderAvatar = result.comment.User.Avatar != null
            //                    ? $"data:image/jpg;base64,{Convert.ToBase64String(result.comment.User.Avatar)}"
            //                    : null,
            //                SenderName = !string.IsNullOrEmpty(result.comment.User.UserName)
            //                    ? result.comment.User.UserName
            //                    : result.comment.User.FirstName + " " + result.comment.User.LastName
            //            })
            //            .ToList()
            //    })
            //    .ToListAsync();

            //    var sortedFeedItems = feedItems
            //        .AsEnumerable()
            //        .OrderByDescending(fi => fi.EventDate)
            //        .Skip(offset)
            //        .Take(take)
            //        .ToList();

            //    return sortedFeedItems;
            //}
            //catch(Exception ex)
            //{
            //    throw;
            //}

            try
            {
                List<FeedItem> feedItems = await _db.PointHistories
                    .Join(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phru) => new { PointHistory = ph, ReceiverUser = phru })
                    .GroupJoin(_db.Likes, phrul => phrul.PointHistory.Id, like => like.PointHistoryId, (phrul, likes) => new { phrul, Likes = likes })
                    .SelectMany(result => result.Likes.DefaultIfEmpty(), (result, like) => new { result.phrul, Like = like })
                    .GroupBy(fi => fi.phrul.PointHistory.Id)
                    .Select(group => new FeedItem()
                    {
                        Id = group.Key,
                        Amount = group.First().phrul.PointHistory.Amount,
                        SenderId = group.First().phrul.PointHistory.SenderId,
                        SenderName = !string.IsNullOrEmpty(group.First().phrul.PointHistory.SenderUser.UserName)
                            ? group.First().phrul.PointHistory.SenderUser.UserName
                            : group.First().phrul.PointHistory.SenderUser.FirstName + " " + group.First().phrul.PointHistory.SenderUser.LastName,
                        SenderAvatar = group.First().phrul.PointHistory.SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(group.First().phrul.PointHistory.SenderUser.Avatar)}" : null,
                        EventDate = group.First().phrul.PointHistory.EventDate,
                        Description = group.First().phrul.PointHistory.Description,
                        EventType = group.First().phrul.PointHistory.EventType,
                        GiphyGif = !string.IsNullOrEmpty(group.First().phrul.PointHistory.GiphyGifUrl)
                            ? group.First().phrul.PointHistory.GiphyGifUrl
                            : null,
                        ReceiverUsers = group.Where(fi => fi.phrul.ReceiverUser != null).Select(fi => new ReceiverUsers()
                        {
                            UserId = fi.phrul.ReceiverUser.Id,
                            UserName = !string.IsNullOrEmpty(fi.phrul.ReceiverUser.User.UserName)
                                ? fi.phrul.ReceiverUser.User.UserName
                                : fi.phrul.ReceiverUser.User.FirstName + " " + fi.phrul.ReceiverUser.User.LastName,
                            UserAvatar = fi.phrul.ReceiverUser.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.phrul.ReceiverUser.User.Avatar)}" : null,
                        }).ToList(),
                        Likes = group.Where(fi => fi.Like != null).Select(fi => new LikeDto()
                        {
                            Id = fi.Like!.Id,
                            LikedById = fi.Like.UserId,
                            LikedByName = !string.IsNullOrEmpty(fi.Like.User.UserName)
                                ? fi.Like.User.UserName
                                : fi.Like.User.FirstName + " " + fi.Like.User.LastName
                        }).ToList(),
                        IsLikedByCurrentUser = group.Where(n => n.Like != null).Any(n => n.Like!.User.Id == userId)
                    })
                    .OrderByDescending(fi => fi.EventDate)
                    .Skip(offset)
                    .Take(take)
                    .ToListAsync();

                List<CommentDto> commentList = new List<CommentDto>()
                {
                    new CommentDto()
                    {
                        Id = 1,
                        Text = "Ez az első comment...",
                        GiphyGif = "https://media4.giphy.com/media/3oAt2dA6LxMkRrGc0g/giphy.gif",
                        SenderId = 1,
                        SenderName = "1. Valaki",
                        CreateDate = DateTime.Now,
                        PointHistoryId = 52,
                        EditDate = null,
                        SenderAvatar = null
                    },
                    new CommentDto()
                    {
                        Id = 2,
                        Text = "Ez a második comment...",
                        GiphyGif = null,
                        SenderId = 1,
                        SenderName = "1. Valaki",
                        CreateDate = DateTime.Now.AddDays(1),
                        PointHistoryId = 52,
                        EditDate = null,
                        SenderAvatar = null
                    },
                    new CommentDto()
                    {
                        Id = 3,
                        Text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta nulla id odio mollis, vitae vehicula metus ullamcorper. Duis sit amet libero pretium, consequat risus ut, efficitur augue. Mauris iaculis neque lorem, et scelerisque ipsum laoreet at. Maecenas at ante nulla. Suspendisse in lacus augue. Duis ornare ullamcorper vulputate. Vestibulum nulla purus, mattis eget nunc sed, lobortis aliquet neque. Donec et enim cursus tellus vulputate ultricies. Donec varius ex ac nunc imperdiet dictum. Morbi non nunc accumsan, mattis sapien in, eleifend nulla. Duis purus mauris, ultrices id mauris at, finibus molestie nisi. Maecenas diam purus, rutrum quis suscipit mattis, imperdiet sed felis.",
                        GiphyGif = "https://media4.giphy.com/media/3oAt2dA6LxMkRrGc0g/giphy.gif",
                        SenderId = 1,
                        SenderName = "1. Valaki",
                        CreateDate = DateTime.Now.AddDays(2),
                        PointHistoryId = 52,
                        EditDate = DateTime.Now.AddDays(5),
                        SenderAvatar = null
                    },
                };

                var targetItem = feedItems.FirstOrDefault(x => x.Id == 52);

                if (targetItem != null)
                {
                    targetItem.Comments.AddRange(commentList);
                }

                return feedItems;
            }
            catch (Exception ex)
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
            catch(Exception ex)
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<CommentDto> AddComment(int userId, CommentDto model)
        {
            try
            {
                var user = await _db.Users.FirstAsync(u => u.Id == userId);

                var commentToCreate = new Comment()
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
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<CommentDto> EditComment(int userId, int commentId, CommentDto model)
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
                    throw new Exception("You can not edit someone else's comment.");
                }

                comment.EditDate = DateTime.Now;
                comment.Text = model.Text!;
                comment.GiphyGifUrl = model.GiphyGif;

                _db.Comments.Update(comment);
                _db.SaveChanges();

                return comment.ToCommentResultDto();
            }
            catch (Exception ex)
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
