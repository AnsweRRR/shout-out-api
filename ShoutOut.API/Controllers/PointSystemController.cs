﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ShoutOut.Dto.PointSystem;
using ShoutOut.Hubs;
using ShoutOut.Interfaces;
using System.Security.Claims;

namespace ShoutOut.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointSystemController: ControllerBase
    {
        private readonly IPointSystemService _pointSystemService;
        IHubContext<SignalRHub> _signalRHubContext;
        public PointSystemController(IPointSystemService pointSystemService, IHubContext<SignalRHub> signalRHubContext)
        {
            _pointSystemService = pointSystemService;
            _signalRHubContext = signalRHubContext;
        }

        [HttpGet("history")]
        [Authorize]
        public async Task<IActionResult> Get(int take, int offset, CancellationToken cancellationToken = default)
        {
            string? currentUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (currentUserId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.GetHistory(int.Parse(currentUserId), cancellationToken, take, offset);

            return Ok(result);
        }

        [HttpPost("givepoints")]
        [Authorize]
        public async Task<IActionResult> Give(GivePointsDto model, [FromQuery] string connectionId)
        {
            string? senderUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (senderUserId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.GivePoints(int.Parse(senderUserId), model);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("GivePointsEvent", result);

            return Ok(result);
        }

        [HttpPatch("like")]
        [Authorize]
        public async Task<IActionResult> Like([FromQuery] int id, [FromQuery] string connectionId)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.Like(int.Parse(userId), id);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("LikePostEvent", result);

            return Ok();
        }

        [HttpPatch("dislike")]
        [Authorize]
        public async Task<IActionResult> Dislike([FromQuery] int id, [FromQuery] string connectionId)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.Dislike(int.Parse(userId), id);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("DislikePostEvent", result);

            return Ok();
        }

        [HttpPost("addcomment")]
        [Authorize]
        public async Task<IActionResult> AddComment([FromBody] CommentDto model, [FromQuery] string connectionId)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.AddComment(int.Parse(userId), model);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("AddCommentEvent", result);

            return Ok(result);
        }

        [HttpPatch("editcomment")]
        [Authorize]
        public async Task<IActionResult> EditComment([FromQuery] int id, [FromBody] CommentDto model, [FromQuery] string connectionId)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.EditComment(int.Parse(userId), id, model);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("EditCommentEvent", result);

            return Ok(result);
        }

        [HttpDelete("deletecomment")]
        [Authorize]
        public async Task<IActionResult> DeleteComment([FromQuery] int id, [FromQuery] string connectionId)
        {
            string? userId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
            {
                return BadRequest();
            }

            var result = await _pointSystemService.DeleteComment(int.Parse(userId), id);

            await _signalRHubContext.Clients.AllExcept(connectionId).SendAsync("DeleteCommentEvent", result);

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
