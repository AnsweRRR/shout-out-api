using shout_out_api.Model;
using System.IdentityModel.Tokens.Jwt;

namespace shout_out_api.Interfaces
{
    public interface ITokenService
    {
        RefreshToken GenerateRefreshToken();
        CookieOptions SetRefreshToken(User user, RefreshToken newRefreshToken);
        string CreateJWTToken(User user);
        JwtSecurityToken Verify(string jwt);
    }
}
