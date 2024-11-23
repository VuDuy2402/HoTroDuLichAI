using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_ThongBao")]
    public class NotificationEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("TieuDeThongBao")]
        [StringLength(maximumLength: 150)]
        public string Title { get; set; } = string.Empty;
        [Column("LoaiThongBao")]
        public CNotificationType Type { get; set; }
        [Column("ThongBaoDaDocChua")]
        public bool IsRead { get; set; }
        [Column("NoiDungThongBao")]
        public string Content { get; set; } = string.Empty;
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        [Column("NgayDoc")]
        public DateTimeOffset? ReadDate { get; set; }
    }
}