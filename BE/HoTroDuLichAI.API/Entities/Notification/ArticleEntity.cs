using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_BaiViet")]
    public class ArticleEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("TieuDeBaiViet")]
        public string Title { get; set; } = string.Empty;
        [Column("NoiDungBaiViet")]
        public string Content { get; set; } = string.Empty;
        [Column("AnhBiaBaiViet")]
        public string Thumbnail { get; set; } = string.Empty;
        [Column("LoaiBaiViet")]
        public CArticleType Type { get; set; }
        [Column("TatCaHinhAnhBaiVietJson")]
        public string ImageProperty { get; set; } = string.Empty;
        [NotMapped]
        public List<ImageProperty> ImageProperties
        {
            get => ImageProperty.FromJson<List<ImageProperty>>();
            set => ImageProperty = value.ToJson();
        }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        [Column("PheDuyetBaiViet")]
        public bool Approved { get; set; }
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Articles")]
        public virtual UserEntity User { get; set; } = null!;
    }
}