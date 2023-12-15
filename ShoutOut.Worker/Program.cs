using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ShoutOut.DataAccess;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;
using ShoutOut.Services;

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
                if (hostContext.HostingEnvironment.IsDevelopment())
                {
                    // This way it's going to read the connectionstring from the api project's appsettings.json
                    var webApiConfigPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "ShoutOut.API");

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
                }
                else
                {
                    services.AddDbContextPool<Context>(opts =>
                    {
                        ConfigHelper configHelper = new ConfigHelper(hostContext.Configuration);
                        string conn = configHelper.ConnectionString.ConnectionString;
                        opts.UseSqlServer(conn);
                    });
                }

                services.AddScoped<ConfigHelper>();
                services.AddScoped<INotificationService, NotificationService>();
                services.AddScoped<IPointSystemService, PointSystemService>();
                services.AddHostedService<Worker>();
            });
    }
}