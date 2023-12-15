using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text;

namespace ShoutOut.Helpers
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (TaskCanceledException taskCancelledException)
            {
                if (taskCancelledException.CancellationToken.IsCancellationRequested)
                {
                    context.Response.StatusCode = StatusCodes.Status200OK;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                var responseByteArray = Encoding.UTF8.GetBytes(ex.Message);
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                context.Response.ContentType = "text/plain";
                await context.Response.Body.WriteAsync(responseByteArray);
            }
        }
    }
}
