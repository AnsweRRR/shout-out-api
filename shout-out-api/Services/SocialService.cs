using shout_out_api.Dto.Social;
using shout_out_api.Helpers;
using shout_out_api.Interfaces;

namespace shout_out_api.Services
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
