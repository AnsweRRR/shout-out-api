using Microsoft.AspNetCore.Mvc;
using ShoutOut.Helpers;

namespace ShoutOut.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionInfoController: ControllerBase
    {
        private readonly ConfigHelper _configHelper;

        public VersionInfoController(ConfigHelper configHelper)
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
