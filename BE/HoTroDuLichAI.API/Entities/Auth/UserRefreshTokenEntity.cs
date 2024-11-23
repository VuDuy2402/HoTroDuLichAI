using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table("TBL_TokenLamMoiNguoiDung")]
    public class UserRefreshTokenEntity
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();

        [Column("TokenLamMoi")]
        public string RefreshToken { get; private set; } = Guid.NewGuid().ToString();

        [Column("TokenTruyCap")]
        public string AccessToken { get; set; } = string.Empty;

        [Column("ThoiGianHetHan")]
        public DateTimeOffset ExpireTime { get; set; }

        [Column("ConHieuLuc")]
        public bool Active => DateTimeOffset.UtcNow <= ExpireTime;

        [Column("ThoiGianThuHoiCuoi")]
        public DateTimeOffset LastRevoked { get; set; }

        [Column("DaBiThuHoi")]
        public bool IsRevoked { get; set; } = false;

        [Column("DiaChiIp")]
        public string RemoteIpAddress { get; set; } = string.Empty;

        [Column("NguoiDungId")]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        [InverseProperty("UserRefreshTokens")]
        public virtual UserEntity User { get; set; } = null!;
    }

}