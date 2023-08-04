using Microsoft.EntityFrameworkCore;
using shout_out_api.DataAccess;
using shout_out_api.Helpers;
using shout_out_api.Services;
using System;

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
                services.AddDbContextPool<Context>(opts =>
                {
                    ConfigHelper configHelper = new ConfigHelper(hostContext.Configuration);
                    string conn = configHelper.ConnectionString.ConnectionString;
                    opts.UseSqlServer(conn);
                });

                services.AddScoped<ConfigHelper>();
                services.AddScoped<PointSystemService>();
                services.AddHostedService<Worker>();
            });
    }
}

//IHost host = Host.CreateDefaultBuilder(args)
//    .ConfigureServices(services =>
//    {
//        services.AddHostedService<Worker.Worker>();
//    })
//    .Build();

//await host.RunAsync();
