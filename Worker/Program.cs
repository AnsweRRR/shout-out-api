using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Helpers;
using shout_out_api.Interfaces;
using shout_out_api.Services;

namespace Worker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .UseWindowsService()
            .ConfigureServices((hostContext, services) =>
            {
                // This way it's going to read the connectionstring from the shout-out-api's appsettings.json
                var webApiConfigPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "shout-out-api");

                var webApiConfig = new ConfigurationBuilder()
                    .SetBasePath(webApiConfigPath)
                    .AddJsonFile("appsettings.json")
                    .Build();

                services.AddDbContextPool<Context>(opts =>
                {
                    ConfigHelper configHelper = new ConfigHelper(webApiConfig);
                    string conn = configHelper.ConnectionString.ConnectionString;
                    opts.UseSqlServer(conn);
                });

                services.AddScoped<ConfigHelper>();
                services.AddScoped<INotificationService, NotificationService>();
                services.AddScoped<IPointSystemService, PointSystemService>();
                services.AddHostedService<Worker>();
            });
    }
}