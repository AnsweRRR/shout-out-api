using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Dto.Email;
using shout_out_api.Dto.User;
using shout_out_api.Helpers;
using shout_out_api.Model;

namespace shout_out_api.Services
{
    public class UserService
    {
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;

        public UserService(TokenService tokenService, EmailService emailService, Context db, ConfigHelper configHelper)
        {
            _tokenService = tokenService;
            _emailService = emailService;
            _db = db;
            _configHelper = configHelper;
        }

        public async Task<LoginResultDto> Login(LoginRequestDto model)
        {
            try
            {
                User? user = await _db.Users.SingleOrDefaultAsync(u => u.Email == model.Email);

                if (user == null || user.Email != model.Email || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                {
                    throw new Exception("Invalid credentials");
                }

                string jwtToken = _tokenService.CreateJWTToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();
                CookieOptions cookieOptions = _tokenService.SetRefreshToken(user, newRefreshToken);

                UserResultDto userDto = user.ToUserResultDto();

                LoginResultDto dto = new LoginResultDto()
                {
                    CookieOptions = cookieOptions,
                    RefreshToken = newRefreshToken.Token,
                    AccessToken = jwtToken,
                    User = userDto
                };

                return dto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<User> CreateUser(InviteRequestDto model, IUrlHelper urlHelper, string requestScheme)
        {
            try
            {
                User newUser = new User
                {
                    Email = model.Email,
                    Role = model.Role,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PointsToGive = 100,
                    PointToHave = 0,
                };

                _db.Users.Add(newUser);
                _db.SaveChanges();

                string emailConfirmationToken = Guid.NewGuid().ToString();
                string confirmLink = $"{_configHelper.ClientApp.BaseUrl}/register:${emailConfirmationToken}";
                string confirmationLink = urlHelper.Action("ConfirmEmail", "User", new { token = emailConfirmationToken }, requestScheme);

                EmailDto emailModel = new EmailDto()
                {
                    ToEmailAddress = newUser.Email,
                    Subject = "Invited to ShoutOut",
                    Body = $"Itt lenne az url helye...{confirmationLink}"
                };

                _emailService.SendEmail(emailModel);

                return newUser;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<User> Register(RegisterRequestDto model)
        {
            try
            {
                DateTime now = DateTime.UtcNow;

                User? user = await _db.Users.SingleOrDefaultAsync(u => u.VerificationToken == model.Token);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if(model.Password != model.ConfirmPassword)
                {
                    throw new Exception("Passwords are not the same.");
                }

                user.Avatar = model.Avatar;
                user.UserName = model.UserName;
                user.Birthday = model.Birthday;
                user.StartAtCompany = model.StartAtCompany;
                user.VerifiedAt = now;
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

                _db.Users.Update(user);
                _db.SaveChanges();

                return user;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<User> EditUser(int userId, EditUserRequestDto model)
        {
            try
            {
                User? user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if(user == null)
                {
                    throw new Exception("User not found");
                }

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.UserName = model.UserName;
                user.Avatar = model.Avatar;
                user.Role = model.Role;

                _db.Update(user);
                _db.SaveChanges();

                return user;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async void DeleteUser(int userId)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if(user == null)
                {
                    throw new Exception("User not found");
                }

                _db.Remove(user);
                _db.SaveChanges();
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        public async Task<RefreshTokenResultDto> RefreshToken(string refreshToken)
        {
            try
            {
                User? user = await _db.Users.SingleOrDefaultAsync(x => x.RefreshToken == refreshToken);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                if (user.TokenExpires < DateTime.Now)
                {
                    throw new Exception("Token expired.");
                }

                string jwtToken = _tokenService.CreateJWTToken(user);

                var newRefreshToken = _tokenService.GenerateRefreshToken();
                CookieOptions cookieOptions = _tokenService.SetRefreshToken(user, newRefreshToken);

                RefreshTokenResultDto dto = new RefreshTokenResultDto()
                {
                    CookieOptions = cookieOptions,
                    RefreshToken = newRefreshToken.Token
                };

                return dto;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<UserResultDto> GetMyUserData(string userId)
        {
            var user = _db.Users.SingleOrDefault(u => u.Id == int.Parse(userId));

            if (user == null)
            {
                throw new Exception("User not found");
            }

            UserResultDto userDto = user.ToUserResultDto();

            return userDto;
        }
    }
}
