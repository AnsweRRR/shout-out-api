using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.User;
using shout_out_api.Services;
using System.Security.Claims;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
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

            Response.Cookies.Append("refreshToken", result.RefreshToken, result.CookieOptions);

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

            Response.Cookies.Append("refreshToken", result.RefreshToken, result.CookieOptions);

            return Ok(result);
        }

        [HttpPost("refresh-token")]
        [Authorize]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if(refreshToken == null)
            {
                return BadRequest();
            }

            var result = await _userService.RefreshToken(refreshToken);

            Response.Cookies.Append("refreshToken", result.RefreshToken, result.CookieOptions);

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
        public async Task<IActionResult> EditOwnUserAccount(EditUserRequestDto model)
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
        public async Task<IActionResult> EditUser(int userId, EditUserRequestDto model)
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

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetUsers();

            return Ok(users);
        }

        [HttpGet("userdata")]
        [Authorize]
        public async Task<IActionResult> GetUserData(int userId)
        {
            var users = await _userService.GetUserData(userId);

            return Ok(users);
        }
    }
}
