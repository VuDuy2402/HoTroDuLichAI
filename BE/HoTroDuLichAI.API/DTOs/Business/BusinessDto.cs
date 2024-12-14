
using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class BusinessDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public BusinessServiceProperty BusinessServiceProperty{ get; set; } =  new BusinessServiceProperty();
        public CBusinessServiceType BusinssServiceType { get; set; }
        public CApprovalType Appoved { get; set; }
        public bool IsNew { get; set; }
        public string BusinessContactPerson { get; set; } = string.Empty;
        public BusinessContactProperty BusinessContactProperty { get; set; } = null!;
        public Guid UserId { get; set; }
        public virtual UserEntity User { get; set; } = null!;
        public virtual ICollection<BusinessAnalyticEntity> BusinessAnalytics { get; set; } = new List<BusinessAnalyticEntity>();
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();
    }

    public class GetOrDeleteBusinessServiceRequestDto
    {
        public Guid BusinessId { get; set; }
        public Guid ServiceId { get; set; }
    }

    public class UpdateBusinessServiceRequestDto
    {
        public Guid BusinessId { get; set; }
        public BusinessServiceProperty ServiceProperty { get; set; } = null!;
    }

    public class CreateBusinessServiceRequestDto
    {
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
        public Guid BusinessId { get; set; }
    }
}