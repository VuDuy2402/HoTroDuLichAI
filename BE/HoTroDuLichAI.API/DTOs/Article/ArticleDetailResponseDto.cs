namespace HoTroDuLichAI.API
{
    public class ArticleInfoResponseDto
    {
        public Guid ArticleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public CArticleType ArticleType { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public CApprovalType ApprovalType { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
    }

    public class ArticleDetailResponseDto : ArticleInfoResponseDto
    {
        public string Content { get; set; } = string.Empty;
    }
}