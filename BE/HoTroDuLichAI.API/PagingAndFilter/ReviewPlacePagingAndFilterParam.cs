using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class ReviewPlacePagingAndFilterParam : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        [JsonIgnore]
        public bool IsMy { get; set; }
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public bool IsPlace { get; set; }
        public ReviewPlaceFilterProperty? Filter { get; set; }
        public SortProperty? SortProperty { get; set; }
    }
}