namespace HoTroDuLichAI.API
{
    using System.ComponentModel.DataAnnotations;

    public class CreatePlaceRequestDto
    {
        [Required(ErrorMessage = "Địa chỉ không được để trống.")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Trường này không thể để trống.")]
        public bool IsNew { get; set; }

        [Range(-90, 90, ErrorMessage = "Vĩ độ phải nằm trong khoảng từ -90 đến 90.")]
        public float Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Kinh độ phải nằm trong khoảng từ -180 đến 180.")]
        public float Longitude { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên không được để trống.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Loại địa điểm không được để trống.")]
        public CPlaceType PlaceType { get; set; }

        [MinLength(1, ErrorMessage = "Danh sách tệp không được để trống.")]
        public List<string> FileIds { get; set; } = new();
    }

}