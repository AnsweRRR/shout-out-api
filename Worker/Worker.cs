using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using shout_out_api.DataAccess;
using shout_out_api.Helpers;
using shout_out_api.Services;

namespace Worker
{
    public class Worker : BackgroundService
    {
        private Timer _timer;
        private readonly ILogger<Worker> _logger;
        private readonly IConfiguration _configuration;
        private readonly IServiceProvider _serviceProvider;

        public Worker(ILogger<Worker> logger, IConfiguration configuration, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _configuration = configuration;
            _serviceProvider = serviceProvider;
        }

        private DbContextOptions<Context> GetDbContextOptions()
        {
            var optionsBuilder = new DbContextOptionsBuilder<Context>();
            optionsBuilder.UseSqlServer("TODO");
            return optionsBuilder.Options;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                Console.WriteLine("Service started!", DateTime.Now.ToString());

                var now = DateTime.Now;
                //var timeUntilMidnight = DateTime.Today.AddDays(1) - now;

                //_timer = new Timer(DoScheduledDailyTask, null, timeUntilMidnight, TimeSpan.FromDays(1));

                var targetTime = DateTime.Today.AddHours(22).AddMinutes(31);

                TimeSpan timeUntilTargetTime;
                if (now > targetTime)
                {
                    timeUntilTargetTime = targetTime.AddDays(1) - now;
                }
                else
                {
                    timeUntilTargetTime = targetTime - now;
                }

                _timer = new Timer(DoScheduledDailyTask, null, timeUntilTargetTime, TimeSpan.FromDays(1));


                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
        }

        private async void DoScheduledDailyTask(object state)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var pointSystemService = scope.ServiceProvider.GetRequiredService<PointSystemService>();

                    await pointSystemService.ScheduledTask();
                }
            }
            catch(Exception ex)
            {
                //TODO: log exception
            }
        }
    }
}