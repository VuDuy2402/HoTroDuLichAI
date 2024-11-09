using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class MyBaseProfileResponseDto
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
    }

    public class MyProfileDetailResponseDto
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PIN { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public List<ImageBaseInfo> ImageProperties { get; set; } = new();
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? ModifiedDate { get; set; }
    }

    public class UpdateMyProfileRequestDto
    {
        public Guid UserId { get; set; }

        [Required(ErrorMessage = "Họ và tên không được để trống")]
        [StringLength(150, ErrorMessage = "Họ và tên phải ít hơn 150 ký tự")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "PIN không được để trống")]
        [RegularExpression(@"^\d{9}$|^\d{12}$", ErrorMessage = "PIN phải là số căn cước công dân hoặc chứng minh nhân dân của Việt Nam")]
        public string PIN { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
        // public List<AddressProperty> AddressProperties { get; set; } = new();

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [RegularExpression(@"^(0|\+84)[1-9][0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng của Việt Nam")]
        public string PhoneNumber { get; set; } = string.Empty;

        [MinAge(10, ErrorMessage = "Ngày sinh phải lớn hơn 10 tuổi")]
        public DateOnly? DateOfBirth { get; set; }
    }

    public class UpdateMyImageRequestDto
    {
        public string FileId { get; set; } = string.Empty;
        public CImageType ImageType { get; set; }
        public CBlobType UploadProvider { get; set; }
    }

    public class ImageBaseInfo
    {
        public string FileId { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public CBlobType ProviderType { get; set; }
        public CImageType Type { get; set; }
        public bool IsDefault { get; set; }
    }
}