using Microsoft.AspNetCore.Http;

namespace ShoutOut.Dto.User
{
    public class RefreshTokenResultDto
    {
        public CookieOptions CookieOptions { get; set; }

        public string RefreshToken { get; set; }
    }
}
