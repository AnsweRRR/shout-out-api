using shout_out_api.Dto.Social;

namespace shout_out_api.Interfaces
{
    public interface ISocialService
    {
        List<SocialInfoDto> GetSocialInfo(CancellationToken cancellationToken);
    }
}
