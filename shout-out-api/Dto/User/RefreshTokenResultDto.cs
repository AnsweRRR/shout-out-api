namespace shout_out_api.Dto.User
{
    public class RefreshTokenResultDto
    {
        public CookieOptions CookieOptions { get; set; }

        public string RefreshToken { get; set; }
    }
}
