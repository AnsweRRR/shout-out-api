using Microsoft.AspNetCore.Mvc;
using shout_out_api.Helpers;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionInfo: ControllerBase
    {
        private readonly ConfigHelper _configHelper;

        public VersionInfo(ConfigHelper configHelper)
        {
            _configHelper = configHelper;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var result = _configHelper.Version.VersionNumber;

            return Ok(result);
        }
    }
}
