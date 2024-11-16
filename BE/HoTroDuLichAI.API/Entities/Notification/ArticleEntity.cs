using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Notification_Article")]
    public class ArticleEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Thumbnail { get; set; } = string.Empty;
        public CArticleType Type { get; set; }
        public string ImageProperty { get; set; } = string.Empty;
        [NotMapped]
        public List<ImageProperty> ImageProperties
        {
            get => ImageProperty.FromJson<List<ImageProperty>>();
            set => ImageProperty = value.ToJson();
        }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public bool Approved { get; set; }
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Articles")]
        public virtual UserEntity User { get; set; } = null!;
    }
}