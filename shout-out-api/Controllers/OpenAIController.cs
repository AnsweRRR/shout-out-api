using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shout_out_api.Interfaces;

namespace shout_out_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpenAIController : ControllerBase
    {
        private readonly IOpenAIService _openAIService;
        public OpenAIController(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetResponseFromOpenAI(string input, CancellationToken cancellationToken = default)
        {
            var result = await _openAIService.GetResponseFromOpenAI(input, cancellationToken);

            return Ok(result);
        }
    }
}
