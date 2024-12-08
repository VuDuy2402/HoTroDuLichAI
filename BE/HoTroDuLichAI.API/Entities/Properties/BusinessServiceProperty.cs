using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class BusinessServiceProperty
    {
        [Required(ErrorMessage = "Mã dịch vụ là bắt buộc.")]
        public Guid ServiceId { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Tên dịch vụ là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên dịch vụ không được vượt quá 100 ký tự.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Trạng thái dịch vụ là bắt buộc.")]
        public CBusinessServiceStatus Status { get; set; }

        [Required(ErrorMessage = "Loại dịch vụ là bắt buộc.")]
        public CBusinessServiceType Type { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Số tiền phải lớn hơn hoặc bằng 0.")]
        public decimal Amount { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Số lượng phải là số nguyên dương.")]
        public int Quantity { get; set; }

        [StringLength(500, ErrorMessage = "Đường dẫn hình ảnh không được vượt quá 500 ký tự.")]
        public string Thumbnail { get; set; } = string.Empty;
    }

    public class BusinessContact
    {
        [Required(ErrorMessage = "Mã liên hệ là bắt buộc.")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Tên liên hệ là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên liên hệ không được vượt quá 100 ký tự.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email là bắt buộc.")]
        [EmailFormat(ErrorMessage = "Email không hợp lệ.")]
        [StringLength(100, ErrorMessage = "Email không được vượt quá 100 ký tự.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc.")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Đường dẫn ảnh đại diện không được vượt quá 500 ký tự.")]
        public string Avatar { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Mã tệp không được vượt quá 100 ký tự.")]
        public string FileId { get; set; } = string.Empty;
    }


    public enum CBusinessServiceStatus
    {
        None = 0,
        Available = 1,
        NotAvailable = 2
    }

    public enum CBusinessServiceType
    {
        [Description("Không xác định")]
        None = 0,
        [Description("Khách sạn")]
        Hotel = 1,
        [Description("Khu nghỉ dưỡng")]
        Villa = 2,
        [Description("Nhà hàng")]
        Restaurant = 3
    }
}