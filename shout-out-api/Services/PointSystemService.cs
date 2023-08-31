using GiphyDotNet.Manager;
using GiphyDotNet.Model.Parameters;
using GiphyDotNet.Model.Results;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using shout_out_api.DataAccess;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Helpers;
using shout_out_api.Model;
using shout_out_api.Model.Interfaces;

namespace shout_out_api.Services
{
    public class PointSystemService
    {
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;

        public PointSystemService(Context db, ConfigHelper configHelper)
        {
            _db = db;
            _configHelper = configHelper;
        }

        public async Task<IList<FeedItem>> GetHistory()
        {
            try
            {
                List<FeedItem> history = await _db.PointHistories
                    .Join(_db.PointHistory_ReceiverUsers, ph => ph.Id, phru => phru.PointHistoryId, (ph, phru) => new { PointHistory = ph, ReceiverUsers = phru })
                    .Select(fi => new FeedItem()
                    {
                        Id = fi.PointHistory.Id,
                        Amount = fi.PointHistory.Amount,
                        SenderId = fi.PointHistory.SenderId,
                        SenderName = !string.IsNullOrEmpty(fi.PointHistory.SenderUser.UserName)
                            ? fi.PointHistory.SenderUser.UserName
                            : fi.PointHistory.SenderUser.FirstName + fi.PointHistory.SenderUser.LastName,
                        SenderAvatar = fi.PointHistory.SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.PointHistory.SenderUser.Avatar)}" : null,
                        EventDate = fi.PointHistory.EventDate,
                        Description = fi.PointHistory.Description,
                        EventType = fi.PointHistory.EventType,
                        GiphyGif = "https://media1.giphy.com/media/CuMiNoTRz2bYc/giphy.gif",
                        ReceiverUsers = new List<ReceiverUsers>()
                        {
                            new ReceiverUsers()
                            {
                                UserId = fi.ReceiverUsers.Id,
                                UserName = !string.IsNullOrEmpty(fi.ReceiverUsers.User.UserName)
                                    ? fi.ReceiverUsers.User.UserName
                                    : fi.ReceiverUsers.User.FirstName + fi.ReceiverUsers.User.LastName,
                                UserAvatar = fi.ReceiverUsers.User.Avatar != null ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.ReceiverUsers.User.Avatar)}" : null,
                            }
                        }
                    })
                    .ToListAsync();

                /*
                List<FeedItem> history = await _db.PointHistory_ReceiverUsers
                    .Include(phru => phru.User)
                    .Include(phru => phru.PointHistory)
                    .Select(fi => new FeedItem()
                    {
                        Id = fi.PointHistoryId,
                        Amount = fi.PointHistory.Amount,
                        SenderId = fi.PointHistory.SenderId,
                        SenderName = !string.IsNullOrEmpty(fi.PointHistory.SenderUser.UserName)
                            ? fi.PointHistory.SenderUser.UserName
                            : fi.PointHistory.SenderUser.FirstName + fi.PointHistory.SenderUser.LastName,
                        SenderAvatar = fi.PointHistory.SenderUser.Avatar != null
                            ? $"data:image/jpg;base64,{Convert.ToBase64String(fi.PointHistory.SenderUser.Avatar)}" : null,
                        EventDate = fi.PointHistory.EventDate,
                        Description = fi.PointHistory.Description,
                        EventType = fi.PointHistory.EventType,
                        GiphyGif = "https://media1.giphy.com/media/CuMiNoTRz2bYc/giphy.gif"
                    })
                    .ToListAsync();
                */
                return history;
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
                    DateTimeOffset now = DateTimeOffset.UtcNow;

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
            try
            {
                DateTime now = DateTime.Now;

                List<User> users = await _db.Users.ToListAsync();

                foreach (var user in users)
                {
                    if (user.Birthday.HasValue && user.Birthday.Value.Date == now.Date)
                    {
                        //TODO: Create Birthday point event
                    }

                    if (user.StartAtCompany.HasValue && user.StartAtCompany.Value.Date == now.Date)
                    {
                        //TODO: Create StartAtCompany point event
                    }

                    if (now.Day == 1)
                    {
                        user.PointsToGive = 100;
                    }
                }

                _db.Users.UpdateRange(users);
                _db.SaveChanges();
            }
            catch (Exception ex)
            {
                //TODO: log the error
            }
        }

        public async Task<GiphySearchResult?> GetGiphyGifs(string? filterName = null)
        {
            var giphy = new Giphy(_configHelper.Giphy.ApiKey);

            var gifResult = await giphy.GifSearch(new SearchParameter() { Query = filterName, Offset = 10, Limit = 10 });

            return gifResult;
        }
    }
}
