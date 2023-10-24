using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.User;

namespace shout_out_api.Interfaces
{
    public interface IUserService
    {
        Task<LoginResultDto> Login(LoginRequestDto model);
        Task CreateUser(InviteRequestDto model, IUrlHelper urlHelper, string requestScheme);
        Task VerifyInviteToken(string verificationToken);
        Task<LoginResultDto> Register(RegisterRequestDto model);
        Task EditUser(int userId, EditUserRequestDto model, bool editByAdmin);
        Task DeleteUser(int userId);
        Task<List<UserResultDto>> GetUsers();
        Task<UserResultDto> GetUserData(int userId);
        Task<LoginResultDto> RefreshToken(string refreshToken);
        Task<UserResultDto> GetMyUserData(string userId);
        Task<string> ResetPasswordRequest(string email);
        Task<UserResultDto> ResetPassword(ResetPasswordDto resetPasswordDto);
        Task<UserResultDto> ChangePassword(int userId, ChangePasswordDto changePasswordDto);
    }
}
