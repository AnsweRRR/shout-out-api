using ShoutOut.Model;
using System.IdentityModel.Tokens.Jwt;

namespace ShoutOut.Interfaces
{
    public interface ITokenService
    {
        RefreshToken GenerateRefreshToken();
        CookieOptions SetRefreshToken(User user, RefreshToken newRefreshToken);
        string CreateJWTToken(User user);
        JwtSecurityToken Verify(string jwt);
    }
}
