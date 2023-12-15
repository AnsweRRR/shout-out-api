
namespace ShoutOut.Dto.User
{
    public class LoginResultDto
    {
        public CookieOptions CookieOptions { get; set; }
        public string RefreshToken { get; set; }
        public string AccessToken { get; set; }
        public UserResultDto User { get; set; }
    }
}
