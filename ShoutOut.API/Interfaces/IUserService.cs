using Microsoft.AspNetCore.Mvc;
using ShoutOut.Dto.User;

namespace ShoutOut.Interfaces
{
    public interface IUserService
    {
        Task<LoginResultDto> Login(LoginRequestDto model);
        Task CreateUser(InviteRequestDto model, IUrlHelper urlHelper, string requestScheme);
        Task VerifyInviteToken(string verificationToken);
        Task<LoginResultDto> Register(RegisterRequestDto model);
        Task EditUser(int userId, EditUserRequestDto model, bool editByAdmin);
        Task DeleteUser(int userId);
        Task InactivateUser(int userId);
        Task ReactivateUser(int userId);
        Task<List<UserResultDto>> GetUsers(int userId, bool onlyVerified);
        Task<UserResultDto> GetUserData(int userId);
        Task<LoginResultDto> RefreshToken(string refreshToken);
        Task<UserResultDto> GetMyUserData(string userId);
        Task<string> ResetPasswordRequest(string email);
        Task<UserResultDto> ResetPassword(ResetPasswordDto resetPasswordDto);
        Task<UserResultDto> ChangePassword(int userId, ChangePasswordDto changePasswordDto);
    }
}
