namespace HoTroDuLichAI.API
{
    public class CloudSetting
    {
        public ImageKitIO ImageKitIO { get; set; } = null!;
        // public CloudinarySetting CloudinarySetting { get; set; } = null!;
    }

    public class ImageKitIO
    {
        public string ImageKitId { get; set; } = string.Empty;
        public string UrlEndpoint { get; set; } = string.Empty;
        public string PublicKey { get; set; } = string.Empty;
        public string PrivateKey { get; set; } = string.Empty;
    }
}