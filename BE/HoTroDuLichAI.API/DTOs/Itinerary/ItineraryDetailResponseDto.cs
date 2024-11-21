

namespace HoTroDuLichAI.API
{
    public class ItineraryDetailResponseDto
    {
        public Guid ItineraryDetailId { get; set; }
        public Guid ItineraryId { get; set; }
        public Guid BusinessId { get; set; }
        public Guid PlaceId { get; set; }
        public TimeOnly Time { get; set; }
        public BusinessProperty BusinessProperty { get; set; } = null!;
    }

    public class BusinessProperty
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public BusinessContactProperty ContactPerson { get; set; } = null!;
        public List<BusinessServiceProperty> ServiceProperties { get; set; } = new();
    }
}