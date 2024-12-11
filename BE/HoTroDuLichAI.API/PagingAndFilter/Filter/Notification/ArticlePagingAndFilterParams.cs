using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class ArticlePagingAndFilterParams : PagingParams
    {
        public string SearchQuery { get; set; } = string.Empty;
        [JsonIgnore]
        public bool IsAdmin { get; set; }
        [JsonIgnore]
        public bool IsMy { get; set; }
        public ArticleFilterProperty FilterProperty { get; set; } = null!;
        public ArticleSorterProperty SorterProperty { get; set; } = null!;
    }
}