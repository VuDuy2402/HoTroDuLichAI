namespace HoTroDuLichAI.API
{
    public class SendMessageRequestDto
    {
        public Guid ReceiverId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class GetMessageChatRequestDto
    {
        public Guid ReceiverId { get; set; }
    }

    public class MessageDetailResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public bool IsSender { get; set; }
        public DateTimeOffset SendDate { get; set; }
    }
}