namespace HoTroDuLichAI.API
{
    public class CreateArticleRequestDto
    {
        public Guid ArticleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public CArticleType Type { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public DateTimeOffset CreatedDate { get; set; }
        public CApprovalType Approved { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
        public List<string> FileIds { get; set; } = new();

    }
}