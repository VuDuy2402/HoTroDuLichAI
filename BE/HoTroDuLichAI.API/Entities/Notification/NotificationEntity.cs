using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Notification_Notification")]
    public class NotificationEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [StringLength(maximumLength: 150)]
        public string Title { get; set; } = string.Empty;
        public CNotificationType Type { get; set; }
        public bool IsRead { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public DateTimeOffset? ReadDate { get; set; }
    }
}