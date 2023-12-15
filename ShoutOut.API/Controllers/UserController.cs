using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoutOut.Dto.User;
using ShoutOut.Interfaces;
using ShoutOut.Services;
using System.Security.Claims;

namespace ShoutOut.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public static string REFRESH_TOKEN_NAME = "ShoutOut_RefreshToken";

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("passwordtest")]
        [AllowAnonymous]
        public IActionResult PasswordTest(string password)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var verifyPassword = BCrypt.Net.BCrypt.Verify(password, hashedPassword);

            return Ok(new { hashedPassword, isCorrect = verifyPassword });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequestDto model)
        {
            var result = await _userService.Login(model);

            Response.Cookies.Append(REFRESH_TOKEN_NAME, result.RefreshToken, result.CookieOptions);

            return Ok(result);
        }

        [HttpPost("inviteuser")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> InviteUser(InviteRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _userService.CreateUser(model, Url, Request.Scheme);

            return Ok();
        }

        [HttpGet("verifyinvitetoken")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyInviteToken(string verificationToken)
        {
            await _userService.VerifyInviteToken(verificationToken);

            return Ok();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.Register(model);

            Response.Cookies.Append(REFRESH_TOKEN_NAME, result.RefreshToken, result.CookieOptions);

            return Ok(result);
        }

        [HttpPost("refresh-token")]
        [Authorize]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies[REFRESH_TOKEN_NAME];

            if(refreshToken == null)
            {
                return BadRequest();
            }

            var result = await _userService.RefreshToken(refreshToken);

            Response.Cookies.Append(REFRESH_TOKEN_NAME, result.RefreshToken, result.CookieOptions);

            return Ok(result);
        }

        [HttpGet("my-account")]
        [Authorize]
        public async Task<IActionResult> MyAccount()
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var user = await _userService.GetMyUserData(userId);

            return Ok(user);
        }

        [HttpPatch("editownuseraccount")]
        [Authorize]
        public async Task<IActionResult> EditOwnUserAccount([FromForm] EditUserRequestDto model)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _userService.EditUser(int.Parse(userId), model, false);

            return Ok();
        }

        [HttpPatch("edit")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditUser([FromQuery] int userId, EditUserRequestDto model)
        {
            await _userService.EditUser(userId, model, true);

            return Ok();
        }

        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            await _userService.DeleteUser(userId);

            return Ok();
        }

        [HttpPost("inactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> InactivateUser([FromQuery] int userId)
        {
            await _userService.InactivateUser(userId);

            return Ok();
        }

        [HttpPost("reactivate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReactivateUser([FromQuery] int userId)
        {
            await _userService.ReactivateUser(userId);

            return Ok();
        }

        [HttpGet("users")]
        [Authorize]
        public async Task<IActionResult> GetUsers([FromQuery] bool onlyVerified = false)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var users = await _userService.GetUsers(int.Parse(userId), onlyVerified);

            return Ok(users);
        }

        [HttpGet("userdata")]
        [Authorize]
        public async Task<IActionResult> GetUserData(int userId)
        {
            var users = await _userService.GetUserData(userId);

            return Ok(users);
        }

        [HttpPost("resetpasswordrequest")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPasswordRequest(string email)
        {
            var result = await _userService.ResetPasswordRequest(email);

            return Ok(result);
        }

        [HttpPost("resetpassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var result = await _userService.ResetPassword(model);

            return Ok(result);
        }

        [HttpPost("changepassword")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _userService.ChangePassword(int.Parse(userId), model);

            return Ok();
        }
    }
}
