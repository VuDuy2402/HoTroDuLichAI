using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_TinNhan")]
    public class MessageEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("NguoiGuiId")]
        public Guid SenderId { get; set; }
        [Column("NguoiNhanId")]
        public Guid ReceiverId { get; set; }
        [Column("NoiDungTinNhan")]
        public string Content { get; set; } = string.Empty;
        [Column("TrangThaiTinNhan")]
        public CSendMessageStatus Status { get; set; }
        private DateTimeOffset _sendDate = DateTimeOffset.UtcNow;
        [Column("NgayGui")]
        public DateTimeOffset SendDate
        {
            get => _sendDate.ToLocalTime();
            private set => _sendDate = value;
        }
        [ForeignKey(name: "SenderId")]
        [InverseProperty(property: "SentMessages")]
        public virtual UserEntity Sender { get; set; } = null!;
        [ForeignKey(name: "ReceiverId")]
        [InverseProperty(property: "ReceivedMessages")]
        public virtual UserEntity Receiver { get; set; } = null!;
    }
}