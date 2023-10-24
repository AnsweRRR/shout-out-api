using shout_out_api.Dto.Notification;
using shout_out_api.Dto.Reward;
using shout_out_api.Dto.User;
using shout_out_api.Enums;
using shout_out_api.Model;

namespace shout_out_api.Helpers
{
    public static class Mapper
    {
        public static UserResultDto ToUserResultDto(this User entity)
        {
            UserResultDto userResultDto = new UserResultDto()
            {
                Id = entity.Id,
                UserName = entity.UserName,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Role = entity.Role,
                StartAtCompany = entity.StartAtCompany,
                Birthday = entity.Birthday,
                PointsToGive = entity.PointsToGive,
                PointToHave = entity.PointToHave,
                RefreshToken = entity.RefreshToken,
                Verified = entity.VerifiedAt.HasValue
            };

            if(entity.Avatar != null)
            {
                var imageBase64string = Convert.ToBase64String(entity.Avatar);
                var fileTpye = "jpg";
                var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                userResultDto.Avatar = source;
            }

            return userResultDto;
        }

        public static List<UserResultDto> ToUsersResultDto(this List<User> entities)
        {
            List<UserResultDto> usersList = new List<UserResultDto>();

            foreach (var entity in entities)
            {
                UserResultDto userResultDto = new UserResultDto()
                {
                    Id = entity.Id,
                    UserName = entity.UserName,
                    FirstName = entity.FirstName,
                    LastName = entity.LastName,
                    Email = entity.Email,
                    Role = entity.Role,
                    Verified = entity.VerifiedAt.HasValue
                };

                if (entity.Avatar != null)
                {
                    var imageBase64string = Convert.ToBase64String(entity.Avatar);
                    var fileTpye = "jpg";
                    var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                    userResultDto.Avatar = source;
                }

                usersList.Add(userResultDto);
            }

            return usersList;
        }

        public static RewardDto ToRewardResultDto(this Reward entity)
        {
            RewardDto rewardDto = new RewardDto()
            {
                Id = entity.Id,
                Name = entity.Name,
                Cost = entity.Cost,
                Description = entity.Description,
            };

            if (entity.Avatar != null)
            {
                var imageBase64string = Convert.ToBase64String(entity.Avatar);
                var fileTpye = "jpg";
                var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                rewardDto.Avatar = source;
            }

            return rewardDto;
        }

        public static List<RewardDto> ToRewardResultDto(this List<Reward> entities)
        {
            List<RewardDto> rewardList = new List<RewardDto>();

            foreach (var entity in entities)
            {
                RewardDto rewardDto = new RewardDto()
                {
                    Id = entity.Id,
                    Name = entity.Name,
                    Cost = entity.Cost,
                    Description = entity.Description,
                };

                if (entity.Avatar != null)
                {
                    var imageBase64string = Convert.ToBase64String(entity.Avatar);
                    var fileTpye = "jpg";
                    var source = $"data:image/{fileTpye};base64,{imageBase64string}";
                    rewardDto.Avatar = source;
                }

                rewardList.Add(rewardDto);
            }

            return rewardList;
        }

        //-----

        public static NotificationItemDto ToNotificationItemDto(this Notification entity)
        {
            NotificationItemDto notificationItemDto = new NotificationItemDto()
            {
                Id = entity.Id,
                DateTime = entity.DateTime,
                EventType = (NotificationEventType)entity.EventType,
                IsRead = entity.IsRead,
                PointAmount = entity.PointAmount,
                RewardName = entity.Reward != null ? entity.Reward.Name : null
            };

            if (entity.SenderUser != null)
            {
                notificationItemDto.SenderUserName = !string.IsNullOrEmpty(entity.SenderUser?.UserName)
                    ? entity.SenderUser.UserName : entity.SenderUser?.FirstName + " " + entity.SenderUser?.LastName;
            }
            else
            {
                notificationItemDto.SenderUserName = null;
            }

            return notificationItemDto;
        }

        public static List<NotificationItemDto> ToNotificationItemsDto(this List<Notification> entities)
        {
            List<NotificationItemDto> notificationList = new List<NotificationItemDto>();

            foreach (var entity in entities)
            {
                NotificationItemDto notificationItemDto = new NotificationItemDto()
                {
                    Id = entity.Id,
                    DateTime = entity.DateTime,
                    EventType = (NotificationEventType)entity.EventType,
                    IsRead = entity.IsRead,
                    PointAmount = entity.PointAmount,
                    RewardName = entity.RewardId.HasValue ? entity.Reward!.Name : null
                };

                if (entity.SenderUserId.HasValue)
                {
                    notificationItemDto.SenderUserName = !string.IsNullOrEmpty(entity.SenderUser?.UserName)
                        ? entity.SenderUser.UserName : entity.SenderUser?.FirstName + " " + entity.SenderUser?.LastName;
                }
                else
                {
                    notificationItemDto.SenderUserName = null;
                }

                notificationList.Add(notificationItemDto);
            }

            return notificationList;
        }
    }
}
