using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table("TBL_TokenNguoiDung")]
    public class UserTokenEntity
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();

        [Column("MaToken")]
        public string Token { get; set; } = string.Empty;

        [Column("Ten")]
        public string Name { get; set; } = string.Empty;

        [Column("LoaiToken")]
        public CTokenType Type { get; set; }

        [Column("LoaiCungCapToken")]
        public CTokenProviderType TokenProviderType { get; set; }

        [Column("TenNhaCungCapToken")]
        public string TokenProviderName { get; set; } = string.Empty;

        [Column("HanToken")]
        public DateTimeOffset TokenExpiration { get; set; }

        [Column("DaSuDungToken")]
        public bool IsTokenInvoked { get; set; } = false;

        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        [Column("NguoiDungId")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        [InverseProperty("UserTokens")]
        public virtual UserEntity User { get; set; } = null!;
    }

}