using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class ItineraryDetailDto
    {
        public Guid Id { get; set; }
        public int Index { get; set; }
        public TimeOnly Time { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public Guid ItineraryId { get; set; }
        public ItineraryDto Itinerary { get; set; } = null!;
        public Guid PlaceId { get; set; }
        public PlaceDto Place { get; set; } = null!;
         [JsonIgnore]
        public List<ReviewPlaceDto> reviewPlace { get; set; } = new();

    }
}