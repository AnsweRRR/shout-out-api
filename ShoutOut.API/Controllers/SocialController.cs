using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShoutOut.Interfaces;

namespace ShoutOut.Controllers
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
