
namespace HoTroDuLichAI.API
{
    public class UserChatBaseInfo
    {
        public string Email { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
    }
}