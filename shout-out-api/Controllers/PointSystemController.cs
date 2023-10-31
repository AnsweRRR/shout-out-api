using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Interfaces;
using shout_out_api.Services;
using System.Security.Claims;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointSystemController: ControllerBase
    {
        private readonly IPointSystemService _pointSystemService;
        public PointSystemController(IPointSystemService pointSystemService)
        {
            _pointSystemService = pointSystemService;
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> Get(int take, int offset)
        {
            var result = await _pointSystemService.GetHistory(take, offset);

            return Ok(result);
        }

        [HttpPost("givepoints")]
        [Authorize]
        public async Task<IActionResult> Give(GivePointsDto model)
        {
            string? senderUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (senderUserId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.GivePoints(int.Parse(senderUserId), model);

            return Ok(result);
        }

        [HttpGet("giphy")]
        [Authorize]
        public async Task<IActionResult> GetGiphyGifs(int limit, int offset, string? filterName = null)
        {
            var result = await _pointSystemService.GetGiphyGifs(limit, offset, filterName);

            return Ok(result);
        }
    }
}
