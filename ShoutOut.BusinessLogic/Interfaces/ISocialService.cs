using ShoutOut.Dto.Social;

namespace ShoutOut.Interfaces
{
    public interface ISocialService
    {
        List<SocialInfoDto> GetSocialInfo(CancellationToken cancellationToken);
    }
}
