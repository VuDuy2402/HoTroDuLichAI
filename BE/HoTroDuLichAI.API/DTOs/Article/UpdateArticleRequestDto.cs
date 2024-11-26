
namespace HoTroDuLichAI.API
{
    public class UpdateArticleRequestDto
    {
        public Guid ArticleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public CArticleType Type { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public DateTimeOffset CreatedDate { get; set; }
        public List<UpdateImageProperty> ImageFiles { get; set; } = new();
        public OwnerProperty OwnerProperty { get; set; } = null!;

    }
}