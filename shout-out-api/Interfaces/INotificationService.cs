using shout_out_api.Dto.Notification;

namespace shout_out_api.Interfaces
{
    public interface INotificationService
    {
        Task<IList<NotificationItemDto>> GetNotifications(int userId, int take = 10, int offset = 0);
        Task<int> GetAmountOfUnreadNotifications(int userId);
        Task<NotificationItemDto> MarkAsRead(int id, int userId);
        Task MarkAllAsRead(int userId);
        Task CreateNotificationAsync(CreateNotificationItemDto notificationItemToCreate);
    }
}
