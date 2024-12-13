
using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class UpdateArticleRequestDto
    {
        public Guid ArticleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public CArticleType ArticleType { get; set; }
        public CApprovalType ApprovalType { get; set; }
        public string ThumbnailFileId { get; set; } = string.Empty;
        public bool IsAdmin { get; set; }
    }
}