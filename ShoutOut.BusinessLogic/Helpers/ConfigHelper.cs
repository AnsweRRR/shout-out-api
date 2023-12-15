using Microsoft.Extensions.Configuration;
using ShoutOut.Dto.Social;

namespace ShoutOut.Helpers
{
    public class ConfigHelper
    {
        private readonly IConfiguration _configuration;

        public ConfigHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ConnectionStringConfig ConnectionString
        {
            get
            {
                bool isEncrypted = false;
                string configValue = _configuration.GetConnectionString("IsConnectionStringEncrypted");
                if (!string.IsNullOrEmpty(configValue))
                {
                    _ = bool.TryParse(configValue, out isEncrypted);
                }


                return new ConnectionStringConfig
                {
                    ConnectionString = _configuration.GetConnectionString("Default"),
                    IsEncrypted = isEncrypted
                };
            }
        }

        public SMTPConfig SMTP
        {
            get
            {
                IConfigurationSection cfgSection = _configuration.GetSection("SMTPConfiguration");

                bool isSenderTheUserName = false;
                if (bool.TryParse(cfgSection["SenderIsTheUserName"], out bool tmp))
                {
                    isSenderTheUserName = tmp;
                }

                bool decryptPassword = false;
                if (bool.TryParse(cfgSection["DecryptPassword"], out bool tmp2))
                {
                    decryptPassword = tmp2;
                }

                return new SMTPConfig
                {
                    Host = cfgSection["Host"],
                    Port = int.Parse(cfgSection["Port"]),
                    Sender = cfgSection["Sender"],
                    SenderIsTheUserName = isSenderTheUserName,
                    UserName = cfgSection["UserName"],
                    Password = cfgSection["Password"],
                    DecryptPassword = decryptPassword,
                    TargetName = cfgSection["TargetName"]
                };
            }
        }

        public TokenConfig Token
        {
            get
            {
                string JWT_Secret_Key = string.Empty;

                if (!string.IsNullOrEmpty(_configuration["Token:JWT_Secret_Key"]))
                {
                    JWT_Secret_Key = _configuration["Token:JWT_Secret_Key"];
                }

                return new TokenConfig
                {
                    JWT_Secret_Key = JWT_Secret_Key
                };
            }
        }

        public GiphyConfig Giphy
        {
            get
            {
                string ApiKey = string.Empty;

                if (!string.IsNullOrEmpty(_configuration["Giphy:ApiKey"]))
                {
                    ApiKey = _configuration["Giphy:ApiKey"];
                }

                return new GiphyConfig
                {
                    ApiKey = ApiKey
                };
            }
        }

        public ClientAppConfig ClientApp
        {
            get
            {
                string baseUrl = string.Empty;

                if (!string.IsNullOrEmpty(_configuration["ClientApp:BaseUrl"]))
                {
                    baseUrl = _configuration["ClientApp:BaseUrl"];
                }

                return new ClientAppConfig
                {
                    BaseUrl = baseUrl
                };
            }
        }

        public VersionConfig Version
        {
            get
            {
                string version = string.Empty;

                if (!string.IsNullOrEmpty(_configuration["VersionNumber"]))
                {
                    version = _configuration["VersionNumber"];
                }

                return new VersionConfig
                {
                    VersionNumber = version
                };
            }
        }

        public SocialConfig Social
        {
            get
            {
                var socialInfo = new List<SocialInfoDto>();

                var socialsFromConfig = _configuration.GetSection("SocialInfo").Get<List<SocialInfoDto>>();

                if (socialsFromConfig != null && socialsFromConfig.Any())
                {
                    socialInfo = socialsFromConfig;
                }

                return new SocialConfig
                {
                    SocialInfo = socialInfo
                };
            }
        }
    }

    public class ConnectionStringConfig
    {
        public string ConnectionString { get; set; }
        public bool IsEncrypted { get; set; }
    }

    public class SMTPConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Sender { get; set; }
        public bool SenderIsTheUserName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool DecryptPassword { get; set; }
        public string TargetName { get; set; }
    }

    public class TokenConfig
    {
        public string JWT_Secret_Key { get; set; }
    }

    public class GiphyConfig
    {
        public string ApiKey { get; set; }
    }

    public class ClientAppConfig
    {
        public string BaseUrl { get; set; }
    }

    public class VersionConfig
    {
        public string VersionNumber { get; set; }
    }

    public class SocialConfig
    {
        public List<SocialInfoDto> SocialInfo { get; set; }
    }
}
