using GiphyDotNet.Manager;
using GiphyDotNet.Model.Parameters;
using GiphyDotNet.Model.Results;
using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Helpers;
using shout_out_api.Model;

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

        public async Task<IList<PointHistory>> GetHistory()
        {
            try
            {
                List<PointHistory> history = await _db.PointHistory_ReceiverUsers
                    .Include(phru => phru.User)
                    .Include(phru => phru.PointHistory)
                    .Select(phru => phru.PointHistory)
                    .ToListAsync();

                return history;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async void GivePoints(int senderUserId, GivePointsDto model)
        {
            try
            {
                DateTimeOffset now = DateTimeOffset.UtcNow;

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
            }
            catch(Exception ex)
            {
                throw;
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
