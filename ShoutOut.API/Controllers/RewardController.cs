using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoutOut.Dto.Reward;
using ShoutOut.Interfaces;
using System.Security.Claims;

namespace ShoutOut.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RewardController: ControllerBase
    {
        private readonly IRewardService _rewardService;

        public RewardController(IRewardService rewardService)
        {
            _rewardService = rewardService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get(CancellationToken cancellationToken = default)
        {
            var result = await _rewardService.GetRewards(cancellationToken);

            return Ok(result);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromForm] RewardCreateEditDto model)
        {
            var result = await _rewardService.AddReward(model);

            return Ok(result);
        }

        [HttpPatch("edit")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int id, [FromForm] RewardCreateEditDto model)
        {
            var result = await _rewardService.EditReward(id, model);

            return Ok(result);
        }

        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _rewardService.DeleteReward(id);

            return Ok();
        }

        [HttpPost("buy")]
        [Authorize]
        public async Task<IActionResult> Buy([FromQuery] int id)
        {
            string? buyerUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (buyerUserId == null)
            {
                return BadRequest();
            }

            var result = await _rewardService.BuyReward(id, int.Parse(buyerUserId));

            return Ok(result);
        }

        [HttpGet("mostpopularrewards")]
        [Authorize]
        public async Task<IActionResult> GetMostPopularRewards(CancellationToken cancellationToken = default)
        {
            var result = await _rewardService.GetMostPopularRewards(cancellationToken);

            return Ok(result);
        }
    }
}