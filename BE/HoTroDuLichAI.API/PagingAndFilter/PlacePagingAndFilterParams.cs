using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class PlacePagingAndFilterParams : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public bool IsMy { get; set; }
        [JsonIgnore]
        public bool IsNew { get; set; }
        public PlaceFilterProperty? FilterProperty { get; set; }
        public PlaceSortProperty? SortProperty { get; set; }
    }
}