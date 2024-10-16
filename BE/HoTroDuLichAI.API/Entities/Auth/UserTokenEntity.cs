using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Admin_UserToken")]
    public class UserTokenEntity
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public CTokenType Type { get; set; }
        public CTokenProviderType TokenProviderType { get; set; }
        public string TokenProviderName { get; set; } = string.Empty;
        public DateTimeOffset TokenExpiration { get; set; }
        public bool IsTokenInvoked { get; set; } = false;
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "UserTokens")]
        public virtual UserEntity User { get; set; } = null!;
    }
}