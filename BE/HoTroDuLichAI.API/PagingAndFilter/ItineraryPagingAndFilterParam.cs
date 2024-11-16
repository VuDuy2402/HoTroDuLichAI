using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class ItineraryPagingAndFilterParam : PagingParams
    {
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public bool IsMy { get; set; }
        public string SearchQuery { get; set; } = string.Empty;
        public ItineraryFilterProperty? FilterProperty{ get; set; }
        public ItinerarySortProperty? SortProperty { get; set; }
    }
}