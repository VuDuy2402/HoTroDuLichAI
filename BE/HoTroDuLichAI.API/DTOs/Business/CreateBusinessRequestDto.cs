using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class CreateBusinessRequestDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong khoảng từ -90 đến 90.")]
        public float Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong khoảng từ -180 đến 180.")]
        public float Longitude { get; set; }
        public Guid ProvinceId { get; set; }
        public BusinessServiceProperty BusinessServiceProperty { get; set; } = new BusinessServiceProperty();
        // public bool IsNew { get; set; }
        public BusinessContactProperty BusinessContactPerson { get; set; } = new BusinessContactProperty();
        public string FileId { get; set; } = string.Empty;
    }
    
}