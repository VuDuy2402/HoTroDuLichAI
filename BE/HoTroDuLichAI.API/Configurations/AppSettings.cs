namespace HoTroDuLichAI.API
{
    public class AppSettings
    {
        public ConnectionStrings ConnectionStrings { get; set; } = null!;
        public ClientApp ClientApp { get; set; } = null!;
        public EmailSetting EmailSetting { get; set; } = null!;
        public JwtSetting JwtSetting { get; set; } = null!;
        public GoogleSetting GoogleSetting { get; set; } = null!;

        public CloudSetting CloudSetting { get; set; } = null!;
        public AdminSetting AdminSetting { get; set; } = null!;
    }
}