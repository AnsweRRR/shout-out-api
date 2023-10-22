using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Services;
using System.Security.Claims;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notificationService;
        public NotificationController(NotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(int take, int offset)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _notificationService.GetNotifications(int.Parse(userId), take, offset);

            return Ok(result);
        }

        [HttpGet("amountofunreadnotifications")]
        [Authorize]
        public async Task<IActionResult> GetAmountOfUnreadNotifications()
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _notificationService.GetAmountOfUnreadNotifications(int.Parse(userId));

            return Ok(result);
        }

        [HttpPost("mark-as-read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead([FromQuery] int id)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _notificationService.MarkAsRead(id, int.Parse(userId));

            return Ok(result);
        }

        [HttpPost("mark-all-as-read")]
        [Authorize]
        public async Task<IActionResult> MarkAllAsRead()
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _notificationService.MarkAllAsRead(int.Parse(userId));

            return Ok();
        }
    }
}
