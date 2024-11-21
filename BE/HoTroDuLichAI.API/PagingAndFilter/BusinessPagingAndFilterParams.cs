using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class BusinessPagingAndFilterParams : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public bool IsMy { get; set; }
        public BusinessFilterProperty FilterProperty { get; set; } = null!;
        public SortProperty SortProperty { get; set; } = null!;
    }
}