using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Interfaces;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SocialController : ControllerBase
    {
        private readonly ISocialService _socialService;
        public SocialController(ISocialService socialService)
        {
            _socialService = socialService;
        }

        [HttpGet]
        [Authorize]
        public IActionResult Get(CancellationToken cancellationToken = default)
        {
            var result = _socialService.GetSocialInfo(cancellationToken);

            return Ok(result);
        }
    }
}
