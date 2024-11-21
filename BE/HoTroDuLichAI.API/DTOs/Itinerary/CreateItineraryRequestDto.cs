
namespace HoTroDuLichAI.API
{
    public class CreateItineraryRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public Guid ProvinceId { get; set; }
    }
}