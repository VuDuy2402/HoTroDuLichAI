
using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class RequestToCreateBusinessRequestDto
    {
        [Required(ErrorMessage = "Bạn cần phải chọn kinh độ trên MAP.")]
        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong khoảng từ -180 đến 180.")]
        public float Longitude { get; set; }
        [Required(ErrorMessage = "Bạn cần phải chọn vĩ độ trên MAP.")]
        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong khoảng từ -90 đến 90.")]
        public float Latitude { get; set; }
        [Required(ErrorMessage = "Địa chỉ không được để trống.")]
        public string Address { get; set; } = string.Empty;
        [Required(ErrorMessage = "Tên doanh nghiệp không được để trống.")]
        public string BusinessName { get; set; } = string.Empty;
        public CBusinessServiceType BusinessType { get; set; }
        [Required(ErrorMessage = "Tỉnh không được để trống.")]
        public Guid? ProvinceId { get; set; }
        public BusinessContactPersonInfoResponseDto ContactPersonInfo  { get; set; } = null!;
    }
}