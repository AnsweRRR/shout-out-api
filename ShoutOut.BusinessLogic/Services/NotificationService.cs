using Microsoft.EntityFrameworkCore;
using ShoutOut.DataAccess;
using ShoutOut.Dto.Notification;
using ShoutOut.Enums;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;
using ShoutOut.Model;

namespace ShoutOut.Services
{
    public class NotificationService: INotificationService
    {
        private readonly Context _db;
        public NotificationService(Context db)
        {
            _db = db;
        }

        public async Task<IList<NotificationItemDto>> GetNotifications(int userId, CancellationToken cancellationToken, int take = 10, int offset = 0)
        {
            try
            {
                List<NotificationItemDto> notificationItemsDto = await _db.Notifications
                    .Where(n => n.ReceiverUserId == userId)
                    .Select(n => new NotificationItemDto()
                    {
                        Id = n.Id,
                        DateTime = n.DateTime,
                        EventType = (NotificationEventType)n.EventType,
                        IsRead = n.IsRead,
                        PointAmount = n.PointAmount,
                        RewardName = n.RewardId.HasValue ? n.Reward!.Name : null,
                        SenderUserName = (n.SenderUserId.HasValue && n.SenderUser != null) ?
                            !string.IsNullOrEmpty(n.SenderUser.UserName) ? n.SenderUser.UserName : n.SenderUser.FirstName + " " + n.SenderUser.LastName : null
                    })
                    .OrderByDescending(n => n.DateTime)
                    .Skip(offset)
                    .Take(take)
                    .ToListAsync(cancellationToken);

                return notificationItemsDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int> GetAmountOfUnreadNotifications(int userId, CancellationToken cancellationToken)
        {
            try
            {
                var totalUnreadNotifications = await _db.Notifications
                    .Where(n => n.ReceiverUserId == userId && !n.IsRead)
                    .CountAsync(cancellationToken);

                return totalUnreadNotifications;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<NotificationItemDto> MarkAsUnRead(int id, int userId)
        {
            try
            {
                var notification = await _db.Notifications
                    .Include(n => n.SenderUser)
                    .Include(n => n.ReceiverUser)
                    .Include(n => n.Reward)
                    .FirstOrDefaultAsync(x => x.Id == id);

                if (notification == null)
                {
                    throw new Exception("Notification not found!");
                }

                if (notification.ReceiverUserId == userId)
                {
                    notification.IsRead = false;

                    _db.Notifications.Update(notification);
                    _db.SaveChanges();
                }

                return notification.ToNotificationItemResultDto();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<NotificationItemDto> MarkAsRead(int id, int userId)
        {
            try
            {
                var notification = await _db.Notifications.FirstOrDefaultAsync(x => x.Id == id);

                if (notification == null)
                {
                    throw new Exception("Notification not found!");
                }

                if (notification.ReceiverUserId == userId)
                {
                    notification.IsRead = true;

                    _db.Notifications.Update(notification);
                    _db.SaveChanges();
                }

                return notification.ToNotificationItemResultDto();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task MarkAllAsRead(int userId)
        {
            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    var notifications = await _db.Notifications.Where(n => n.ReceiverUserId == userId).ToListAsync();

                    foreach (var notification in notifications)
                    {
                        notification.IsRead = true;
                    }

                    _db.Notifications.UpdateRange(notifications);
                    _db.SaveChanges();

                    transaction.Commit();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        public async Task CreateNotificationAsync(CreateNotificationItemDto notificationItemToCreate)
        {
            try
            {
                var notificationToCreate = new Notification()
                {
                    DateTime = DateTime.Now,
                    PointAmount = notificationItemToCreate.PointAmount,
                    EventType = (int)notificationItemToCreate.EventType,
                    SenderUserId = notificationItemToCreate.SenderUserId,
                    ReceiverUserId = notificationItemToCreate.ReceiverUserId,
                    RewardId = notificationItemToCreate.RewardId,
                    IsRead = false
                };

                _db.Notifications.Add(notificationToCreate);
                _db.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
