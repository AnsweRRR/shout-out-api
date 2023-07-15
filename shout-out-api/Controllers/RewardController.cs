using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Dto.Reward;
using shout_out_api.Services;
using System.Security.Claims;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RewardController: ControllerBase
    {
        private readonly RewardService _rewardService;

        public RewardController(RewardService rewardService)
        {
            _rewardService = rewardService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var result = await _rewardService.GetRewards();

            return Ok(result);
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(RewardCreateEditDto model)
        {
            var result = await _rewardService.AddReward(model);

            return Ok(result);
        }

        [HttpPost("edit")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Edit(int id, RewardCreateEditDto model)
        {
            var result = await _rewardService.EditReward(id, model);

            return Ok(result);
        }

        [HttpPost("delete")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            _rewardService.DeleteReward(id);

            return Ok();
        }

        [HttpPost("buy")]
        [Authorize]
        public async Task<IActionResult> Buy(int id)
        {
            string? buyerUserId = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            if (buyerUserId == null)
            {
                return BadRequest();
            }

            var result = await _rewardService.BuyReward(id, int.Parse(buyerUserId));

            return Ok(result);
        }
    }
}