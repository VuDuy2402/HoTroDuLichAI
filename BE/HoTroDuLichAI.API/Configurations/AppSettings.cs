namespace HoTroDuLichAI.API
{
    public class AppSettings
    {
        public ConnectionStrings ConnectionStrings { get; set; } = null!;
        public ClientApp ClientApp { get; set; } = null!;
        public EmailSetting EmailSetting { get; set; } = null!;
        public JwtSetting JwtSetting { get; set; } = null!;
        public GoogleSetting GoogleSetting { get; set; } = null!;
    }
}