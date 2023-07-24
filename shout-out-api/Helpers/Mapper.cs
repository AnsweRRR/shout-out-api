using shout_out_api.Dto.User;
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
                Avatar = entity.Avatar,
                StartAtCompany = entity.StartAtCompany,
                Birthday = entity.Birthday,
                PointsToGive = entity.PointsToGive,
                PointToHave = entity.PointToHave,
                RefreshToken = entity.RefreshToken
            };

            return userResultDto;
        }

    }
}
