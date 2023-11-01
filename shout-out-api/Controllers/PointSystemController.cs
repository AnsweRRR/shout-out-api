using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.PointSystem;
using shout_out_api.Interfaces;
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
            string? currentUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.GetHistory(int.Parse(currentUserId), take, offset);

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

        [HttpPatch("like")]
        [Authorize]
        public async Task<IActionResult> Like([FromQuery] int id)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _pointSystemService.Like(int.Parse(userId), id);

            return Ok();
        }

        [HttpPatch("dislike")]
        [Authorize]
        public async Task<IActionResult> Dislike([FromQuery] int id)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _pointSystemService.Dislike(int.Parse(userId), id);

            return Ok();
        }

        [HttpPost("addcomment")]
        [Authorize]
        public async Task<IActionResult> AddComment(CommentDto model)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _pointSystemService.AddComment(int.Parse(userId), model);

            return Ok();
        }

        [HttpPatch("editcomment")]
        [Authorize]
        public async Task<IActionResult> EditComment([FromQuery] int id, CommentDto model)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _pointSystemService.EditComment(int.Parse(userId), id, model);

            return Ok();
        }

        [HttpDelete("deletecomment")]
        [Authorize]
        public async Task<IActionResult> DeleteComment([FromQuery] int id)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            await _pointSystemService.DeleteComment(int.Parse(userId), id);

            return Ok();
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
