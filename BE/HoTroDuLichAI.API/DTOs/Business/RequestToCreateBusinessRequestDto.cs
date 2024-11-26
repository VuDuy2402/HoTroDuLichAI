
namespace HoTroDuLichAI.API
{
    public class RequestToCreateBusinessRequestDto
    {
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public string Address { get; set; } = string.Empty;
        public string BusinessName { get; set; } = string.Empty;
        public CBusinessServiceType BusinessType { get; set; }
        public Guid ProvinceId { get; set; }
        public BusinessContactPersonInfoResponseDto ContactPersonInfo  { get; set; } = null!;
    }
}