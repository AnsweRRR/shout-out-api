using ShoutOut.Dto.Notification;

namespace ShoutOut.Interfaces
{
    public interface INotificationService
    {
        Task<IList<NotificationItemDto>> GetNotifications(int userId, CancellationToken cancellationToken, int take = 10, int offset = 0);
        Task<int> GetAmountOfUnreadNotifications(int userId, CancellationToken cancellationToken);
        Task<NotificationItemDto> MarkAsUnRead(int id, int userId);
        Task<NotificationItemDto> MarkAsRead(int id, int userId);
        Task MarkAllAsRead(int userId);
        Task CreateNotificationAsync(CreateNotificationItemDto notificationItemToCreate);
    }
}
