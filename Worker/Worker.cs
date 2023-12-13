using shout_out_api.Interfaces;

namespace Worker
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _serviceProvider;

        public Worker(ILogger<Worker> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Service started!");

                var now = DateTime.Now;
                //var timeUntilMidnight = DateTime.Today.AddDays(1) - now;
                //Timer timer = new Timer(DoScheduledDailyTask!, null, timeUntilMidnight, TimeSpan.FromDays(1));


                //TODO: Remove after development and testing is done and get back to "timeUntilMidnight"...
                var targetTime = now.AddSeconds(3);
                TimeSpan timeUntilTargetTime = now > targetTime ? targetTime.AddDays(1) - now : targetTime - now;
                Timer timer = new Timer(DoScheduledDailyTask, null, timeUntilTargetTime, TimeSpan.FromDays(1));

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }

            _logger.LogInformation("Service stopped!");
        }

        private async void DoScheduledDailyTask(object state)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var pointSystemService = scope.ServiceProvider.GetRequiredService<IPointSystemService>();

                    await pointSystemService.ScheduledTask();
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }
    }
}