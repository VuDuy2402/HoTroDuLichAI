namespace HoTroDuLichAI.API
{
    public class CreateArticleRequestDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public CArticleType Type { get; set; }
        public CApprovalType Approved { get; set; }
        public List<ArticleImageDto> ImageDtos { get; set; } = new();
    }

    public class ArticleImageDto
    {
        public string FileId { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public CImageType ImageType { get; set; }
    }
}