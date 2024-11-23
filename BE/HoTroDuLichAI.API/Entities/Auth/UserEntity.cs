using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace HoTroDuLichAI.API
{
    public class UserEntity : IdentityUser<Guid>
    {
        [Column("HoTen")]
        public string FullName { get; set; } = string.Empty;

        [Column("NgaySinh")]
        public DateOnly? DateOfBirth { get; set; }

        [Column("MaPIN")]
        public string PIN { get; set; } = string.Empty;

        [Column("TatCaHinhAnhJson")]
        public string ImageProperty { get; set; } = string.Empty;
        [NotMapped]
        public List<ImageProperty> ImageProperties
        {
            get => ImageProperty.FromJson<List<ImageProperty>>();
            set => ImageProperty = value.ToJson();
        }

        [Column("DiaChi")]
        public string Address { get; set; } = string.Empty;

        [Column("NguoiSua")]
        public string ModifiedBy { get; set; } = string.Empty;

        [Column("NgayTao")]
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        [Column("NgaySua")]
        private DateTimeOffset? _modifiedDate;
        public DateTimeOffset? ModifiedDate
        {
            get => _modifiedDate?.ToLocalTime();
            set => _modifiedDate = value;
        }

        [Column("TenDangNhap")]
        public override string? UserName { get; set; }

        [Column("TenDangNhapChuanHoa")]
        public override string? NormalizedUserName { get; set; }

        [Column("EmailNguoiDung")]
        public override string? Email { get; set; }

        [Column("EmailChuanHoa")]
        public override string? NormalizedEmail { get; set; }

        [Column("XacNhanEmail")]
        public override bool EmailConfirmed { get; set; } = false;

        [Column("MatKhauHash")]
        public override string? PasswordHash { get; set; }

        [Column("DauDauBaoMat")]
        public override string? SecurityStamp { get; set; }

        [Column("DongBoConcurrency")]
        public override string? ConcurrencyStamp { get; set; }

        [Column("SoDienThoai")]
        public override string? PhoneNumber { get; set; }

        [Column("XacNhanSoDienThoai")]
        public override bool PhoneNumberConfirmed { get; set; } = false;

        [Column("TinhNangHaiYeuCau")]
        public override bool TwoFactorEnabled { get; set; } = false;

        [Column("ThoiGianKhoa")]
        public override DateTimeOffset? LockoutEnd { get; set; }

        [Column("KhoaTaiKhoan")]
        public override bool LockoutEnabled { get; set; } = false;

        [Column("SoLanThucThuThatBai")]
        public override int AccessFailedCount { get; set; } = 0;

        [Column("AvatarNguoiDung")]
        public string Avatar { get; set; } = string.Empty;

        
        [InverseProperty("User")]
        public virtual ICollection<UserTokenEntity> UserTokens { get; set; } = new List<UserTokenEntity>();

        [InverseProperty("User")]
        public virtual ICollection<UserRefreshTokenEntity> UserRefreshTokens { get; set; } = new List<UserRefreshTokenEntity>();

        [InverseProperty("User")]
        public virtual ICollection<PlaceEntity> Places { get; set; } = new List<PlaceEntity>();

        [InverseProperty("User")]
        public virtual ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; } = new List<ReviewPlaceEntity>();

        [InverseProperty("User")]
        public virtual ICollection<ItineraryEntity> Itineraries { get; set; } = new List<ItineraryEntity>();

        [InverseProperty("User")]
        public virtual ICollection<BusinessEntity> Businesses { get; set; } = new List<BusinessEntity>();

        [InverseProperty("Sender")]
        public virtual ICollection<MessageEntity> SentMessages { get; set; } = new List<MessageEntity>();

        [InverseProperty("Receiver")]
        public virtual ICollection<MessageEntity> ReceivedMessages { get; set; } = new List<MessageEntity>();

        [InverseProperty("User")]
        public virtual ICollection<ArticleEntity> Articles { get; set; } = new List<ArticleEntity>();

        [InverseProperty("User")]
        public virtual ICollection<AITrainingDataEntity> AITrainingDatas { get; set; } = new List<AITrainingDataEntity>();
    }

}