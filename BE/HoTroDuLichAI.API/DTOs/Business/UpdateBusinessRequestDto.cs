using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class UpdateBusinessRequestDto
    {
        [Required(ErrorMessage = "Mã doanh nghiệp là bắt buộc.")]
        public Guid BusinessId { get; set; }

        [Required(ErrorMessage = "Tên doanh nghiệp là bắt buộc.")]
        [StringLength(200, ErrorMessage = "Tên doanh nghiệp không được vượt quá 200 ký tự.")]
        public string BusinessName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Địa chỉ là bắt buộc.")]
        [StringLength(500, ErrorMessage = "Địa chỉ không được vượt quá 500 ký tự.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Loại dịch vụ doanh nghiệp là bắt buộc.")]
        public CBusinessServiceType BusinessServiceType { get; set; }

        [Required(ErrorMessage = "Trạng thái duyệt doanh nghiệp là bắt buộc.")]
        public CApprovalType Appoved { get; set; }

        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong phạm vi từ -180 đến 180.")]
        public float Longitude { get; set; }

        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong phạm vi từ -90 đến 90.")]
        public float Latitude { get; set; }

        [Required(ErrorMessage = "Mã tỉnh thành là bắt buộc.")]
        public Guid ProvinceId { get; set; }

        [Required(ErrorMessage = "Danh sách dịch vụ doanh nghiệp không được rỗng.")]
        public List<BusinessServiceProperty> ServiceProperties { get; set; } = new List<BusinessServiceProperty>();

        [Required(ErrorMessage = "Thông tin liên hệ doanh nghiệp là bắt buộc.")]
        public BusinessContact BusinessContactProperty { get; set; } = null!;

        [StringLength(100, ErrorMessage = "Mã tệp không được vượt quá 100 ký tự.")]
        public string FileId { get; set; } = string.Empty;

        [JsonIgnore]
        public bool IsBusiness { get; set; }
    }
}