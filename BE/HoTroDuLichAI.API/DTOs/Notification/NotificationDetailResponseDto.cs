
namespace HoTroDuLichAI.API
{
    public class NotificationDetailResponseDto
    {
        public Guid NotificationId { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTimeOffset? ReadDate { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public CNotificationType Type { get; set; }
    }
}