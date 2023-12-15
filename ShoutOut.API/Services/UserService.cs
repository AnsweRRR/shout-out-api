using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoutOut.DataAccess;
using ShoutOut.Dto.Email;
using ShoutOut.Dto.User;
using ShoutOut.Enums;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;
using ShoutOut.Model;

namespace ShoutOut.Services
{
    public class UserService: IUserService
    {
        private static readonly Random random = new Random();

        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly EmailTemplates _emailTemplates;
        private readonly Context _db;
        private readonly ConfigHelper _configHelper;
        private readonly FileConverter _fileConverter;

        public UserService(ITokenService tokenService, IEmailService emailService, EmailTemplates emailTemplates, Context db, ConfigHelper configHelper, FileConverter fileConverter)
        {
            _tokenService = tokenService;
            _emailService = emailService;
            _emailTemplates = emailTemplates;
            _db = db;
            _configHelper = configHelper;
            _fileConverter = fileConverter;
        }

        public async Task<LoginResultDto> Login(LoginRequestDto model)
        {
            try
            {
                User? user = await _db.Users.SingleOrDefaultAsync(u => u.Email == model.Email);

                if (user == null || user.Email != model.Email || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash) || !user.IsActive)
                {
                    throw new Exception("Invalid credentials");
                }

                string jwtToken = _tokenService.CreateJWTToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken.Token;
                user.RefreshTokenCreated = newRefreshToken.Created;
                user.RefreshTokenExpires = newRefreshToken.Expires;
                _db.Update(user);
                _db.SaveChanges();

                CookieOptions cookieOptions = _tokenService.SetRefreshToken(user, newRefreshToken);

                UserResultDto userDto = user.ToUserResultDto();
                userDto.AccessToken = jwtToken;
                userDto.RefreshToken = newRefreshToken.Token;

                LoginResultDto dto = new LoginResultDto()
                {
                    CookieOptions = cookieOptions,
                    RefreshToken = newRefreshToken.Token,
                    AccessToken = jwtToken,
                    User = userDto
                };

                return dto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task CreateUser(InviteRequestDto model, IUrlHelper urlHelper, string requestScheme)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == model.Email && (u.VerifiedAt == null || u.VerifiedAt == DateTime.MinValue));

                if(user == null)
                {
                    //string verificationToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
                    string verificationToken = Guid.NewGuid().ToString();

                    User newUser = new User
                    {
                        Email = model.Email,
                        Role = model.Role,
                        FirstName = model.FirstName,
                        LastName = model.LastName,
                        PointsToGive = 100,
                        PointToHave = 0,
                        VerificationToken = verificationToken,
                        IsActive = false
                    };

                    _db.Users.Add(newUser);
                    _db.SaveChanges();

                    string confirmLink = $"{model.EncodedUrl}/auth/register/{newUser.VerificationToken}";

                    EmailDto emailModel = new EmailDto()
                    {
                        ToEmailAddress = newUser.Email,
                        Subject = _emailTemplates.NEW_USER_CONFIRM_EMAIL_SUBJECT(),
                        Body = _emailTemplates.NEW_USER_CONFIRM_EMAIL_BODY(confirmLink)
                    };

                    _emailService.SendEmail(emailModel);
                }
                else
                {
                    string confirmLink = $"{model.EncodedUrl}/auth/register/{user!.VerificationToken}";

                    EmailDto emailModel = new EmailDto()
                    {
                        ToEmailAddress = user!.Email!,
                        Subject = _emailTemplates.NEW_USER_CONFIRM_EMAIL_SUBJECT(),
                        Body = _emailTemplates.NEW_USER_CONFIRM_EMAIL_BODY(confirmLink)
                    };

                    _emailService.SendEmail(emailModel);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task VerifyInviteToken(string verificationToken)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.VerificationToken == verificationToken);

                if (user == null)
                {
                    throw new Exception("User not found");
                }
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<LoginResultDto> Register(RegisterRequestDto model)
        {
            try
            {
                DateTime now = DateTime.Now;

                var user = await _db.Users.SingleOrDefaultAsync(u => u.VerificationToken == model.Token);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if(model.Password != model.ConfirmPassword)
                {
                    throw new Exception("Passwords are not the same.");
                }

                if(user.VerifiedAt.HasValue && user.VerifiedAt.Value == DateTime.MinValue)
                {
                    throw new Exception("Already registered.");
                }

                //user.Avatar = model.Avatar;
                user.UserName = model.UserName;
                //user.Birthday = model.Birthday;
                //user.StartAtCompany = model.StartAtCompany;
                user.VerifiedAt = now;
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

                string jwtToken = _tokenService.CreateJWTToken(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken.Token;
                user.RefreshTokenCreated = newRefreshToken.Created;
                user.RefreshTokenExpires = newRefreshToken.Expires;
                user.VerificationToken = null;
                user.IsActive = true;

                _db.Update(user);
                _db.SaveChanges();

                CookieOptions cookieOptions = _tokenService.SetRefreshToken(user, newRefreshToken);

                UserResultDto userDto = user.ToUserResultDto();
                userDto.AccessToken = jwtToken;
                userDto.RefreshToken = newRefreshToken.Token;

                LoginResultDto dto = new LoginResultDto()
                {
                    CookieOptions = cookieOptions,
                    RefreshToken = newRefreshToken.Token,
                    AccessToken = jwtToken,
                    User = userDto
                };

                return dto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task EditUser(int userId, EditUserRequestDto model, bool editByAdmin)
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

                if (model.Avatar != null && model.Avatar.Length > 0)
                {
                    byte[] file = _fileConverter.ConvertIFormFileToByteArray(model.Avatar);
                    user.Avatar = file;
                }

                if (!user.StartAtCompany.HasValue)
                {
                    user.StartAtCompany = model.StartAtCompany;
                }

                if (!user.Birthday.HasValue)
                {
                    user.Birthday = model.Birthday;
                }

                if (editByAdmin && model.Role.HasValue)
                {
                    user.Role = (Role)model.Role;
                }

                _db.Update(user);
                _db.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Obsolete]
        public async Task DeleteUser(int userId)
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
            catch(Exception)
            {
                throw;
            }
        }

        public async Task InactivateUser(int userId)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                user.IsActive = false;

                _db.Update(user);
                _db.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task ReactivateUser(int userId)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                user.IsActive = true;

                _db.Update(user);
                _db.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<UserResultDto>> GetUsers(int userId, bool onlyVerified)
        {
            try
            {
                var users = await _db.Users
                    .Where(u => u.Id != userId &&
                        (!onlyVerified || u.VerifiedAt != null))
                    .ToListAsync();

                var userResultDtoList = users.ToUsersResultDto();

                return userResultDtoList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UserResultDto> GetUserData(int userId)
        {
            try
            {
                var user = await _db.Users.Where(u => u.Id == userId).SingleAsync();

                var userResultDto = user.ToUserResultDto();

                return userResultDto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<LoginResultDto> RefreshToken(string refreshToken)
        {
            try
            {
                User? user = await _db.Users.SingleOrDefaultAsync(x => x.RefreshToken == refreshToken);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                if (user.RefreshTokenExpires < DateTime.Now)
                {
                    throw new Exception("Token expired.");
                }

                string jwtToken = _tokenService.CreateJWTToken(user);

                var newRefreshToken = _tokenService.GenerateRefreshToken();

                user.RefreshToken = newRefreshToken.Token;
                user.RefreshTokenCreated = newRefreshToken.Created;
                user.RefreshTokenExpires = newRefreshToken.Expires;
                _db.Update(user);
                _db.SaveChanges();

                CookieOptions cookieOptions = _tokenService.SetRefreshToken(user, newRefreshToken);

                UserResultDto userDto = user.ToUserResultDto();
                userDto.AccessToken = jwtToken;
                userDto.RefreshToken = newRefreshToken.Token;

                LoginResultDto dto = new LoginResultDto()
                {
                    CookieOptions = cookieOptions,
                    RefreshToken = newRefreshToken.Token,
                    AccessToken = jwtToken,
                    User = userDto
                };

                return dto;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UserResultDto> GetMyUserData(string userId)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == int.Parse(userId));

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                UserResultDto userDto = user.ToUserResultDto();

                return userDto;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<string> ResetPasswordRequest(string email)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == email);

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                int sixDigitCode = random.Next(100000, 1000000);

                user.PasswordResetToken = sixDigitCode.ToString("D6");
                user.PasswordResetTokenExpires = DateTime.Now.AddDays(1);

                _db.Users.Update(user);
                _db.SaveChanges();

                EmailDto emailDto = new EmailDto()
                {
                    Subject = _emailTemplates.PASSWORD_RESET_TOKEN_SUBJECT(),
                    Body = _emailTemplates.PASSWORD_RESET_TOKEN_BODY(user.PasswordResetToken),
                    ToEmailAddress = user.Email!
                };

                _emailService.SendEmail(emailDto);

                return user.Email!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<UserResultDto> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Email == resetPasswordDto.Email && u.PasswordResetToken == resetPasswordDto.SixDigitCode);

                if (resetPasswordDto.NewPassword != resetPasswordDto.ConfirmNewPassword)
                {
                    throw new Exception("Passwords are not the same");
                }

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if (user.PasswordResetTokenExpires < DateTime.Now)
                {
                    throw new Exception("Reset password token expired");
                }

                user.PasswordResetToken = null;
                user.PasswordResetTokenExpires = null;
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);

                _db.Users.Update(user);
                _db.SaveChanges();

                var userResultDto = user.ToUserResultDto();

                return userResultDto;
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task<UserResultDto> ChangePassword(int userId, ChangePasswordDto changePasswordDto)
        {
            try
            {
                var user = await _db.Users.SingleOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    throw new Exception("User not found");
                }

                if(!BCrypt.Net.BCrypt.Verify(changePasswordDto.OldPassword, user.PasswordHash))
                {
                    throw new Exception("Incorrect password");
                }

                if(changePasswordDto.NewPassword != changePasswordDto.ConfirmNewPassword)
                {
                    throw new Exception("Passwords are not the same");
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

                _db.Users.Update(user);
                _db.SaveChanges();

                var userResultDto = user.ToUserResultDto();

                return userResultDto;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
