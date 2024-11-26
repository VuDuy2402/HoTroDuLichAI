namespace HoTroDuLichAI.API
{
    public class RequestToBecomeBusinessEmailTemplateModel
    {
        public string BusinessName { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public string ProvinceName { get; set; } = string.Empty;
        public string ContactPersonAvatar { get; set; } = string.Empty;
        public string ContactPersonName { get; set; } = string.Empty;
        public string ContactPersonEmail { get; set; } = string.Empty;
        public string ContactPersonPhoneNumber { get; set; } = string.Empty;
        public string RedirectUrl { get; set; } = string.Empty;
    }
}