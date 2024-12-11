namespace HoTroDuLichAI.API
{
    public class ArticleFilterProperty
    {
        public CArticleType? ArticleType { get; set; }
        public CApprovalType? ApprovalType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }
    }
}