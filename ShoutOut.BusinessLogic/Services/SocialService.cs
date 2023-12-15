using ShoutOut.Dto.Social;
using ShoutOut.Helpers;
using ShoutOut.Interfaces;

namespace ShoutOut.Services
{
    public class SocialService : ISocialService
    {
        private readonly ConfigHelper _configHelper;
        public SocialService(ConfigHelper configHelper)
        {
            _configHelper = configHelper;
        }

        public List<SocialInfoDto> GetSocialInfo(CancellationToken cancellationToken)
        {
            var socialInfo = _configHelper.Social.SocialInfo;

            return socialInfo;
        }
    }
}
