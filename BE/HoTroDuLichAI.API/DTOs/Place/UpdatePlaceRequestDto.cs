using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class UpdatePlaceRequestDto
    {
        public Guid PlaceId { get; set; }
        [Required(ErrorMessage = "Địa chỉ không được để trống.")]
        public string Address { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong khoảng từ khu vực Việt Nam từ {1} đến {0}")]
        public float Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong khoảng từ {1} đến {0}.")]
        public float Longitude { get; set; }
        [Required(ErrorMessage = "Mô tả không được để trống.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên không được để trống.")]
        public string Name { get; set; } = string.Empty;
        public CPlaceType PlaceType { get; set; }
        public List<UpdateImageProperty> ImageFiles { get; set; } = new();
    }

    public class UpdateImageProperty
    {
        public string FileId { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

}