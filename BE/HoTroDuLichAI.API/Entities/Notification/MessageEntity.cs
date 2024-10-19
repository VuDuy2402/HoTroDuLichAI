using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Notification_Message")]
    public class MessageEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SenderId { get; set; }
        public Guid ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public CSendMessageStatus Status { get; set; }
        private DateTimeOffset _sendDate = DateTimeOffset.UtcNow;
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