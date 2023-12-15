using ShoutOut.DataAccess;
using ShoutOut.Helpers;
using ShoutOut.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using ShoutOut.Interfaces;
using ShoutOut.Hubs;

var builder = WebApplication.CreateBuilder(args);

var logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog(logger);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddLogging();

builder.Services.AddDbContext<Context>(opt => opt.UseSqlServer(builder.Configuration.GetSection("ConnectionStrings:Default").Value!));

builder.Services.AddSignalR();

builder.Services.AddScoped<ConfigHelper>();
builder.Services.AddScoped<FileConverter>();
builder.Services.AddScoped<EmailTemplates>();
builder.Services.AddScoped<ImageResizer>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IRewardService, RewardService>();
builder.Services.AddScoped<IPointSystemService, PointSystemService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<ISocialService, SocialService>();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Token:JWT_Secret_Key").Value!))
    };
});

builder.Services.AddCors(options => options.AddPolicy(name: "ShoutOut-Origins",
    policy =>
    {
        policy.WithOrigins(new[] { "http://localhost:3000", "http://localhost:3001" })
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    })
);

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options => options.DefaultModelsExpandDepth(-1));

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI(options => options.DefaultModelsExpandDepth(-1));
//}

app.UseCors("ShoutOut-Origins");

app.UseSerilogRequestLogging();
app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
    endpoints.MapHub<SignalRHub>("/signalRHub");
});

app.MapControllers();

app.Run();