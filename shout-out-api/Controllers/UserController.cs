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
        public async Task<IActionResult> PasswordTest(string password)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            var verifyPassword = BCrypt.Net.BCrypt.Verify(password, hashedPassword);

            return Ok(new { hashedPassword = hashedPassword, isCorrect = verifyPassword });
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
        public IActionResult InviteUser(InviteRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _userService.CreateUser(model, Url, Request.Scheme);

            return Ok(user);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register(RegisterRequestDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _userService.Register(model);

            return Ok();
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
    }
}
