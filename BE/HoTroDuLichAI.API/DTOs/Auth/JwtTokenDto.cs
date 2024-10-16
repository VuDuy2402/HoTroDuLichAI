namespace HoTroDuLichAI.API
{
    public class JwtTokenDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}