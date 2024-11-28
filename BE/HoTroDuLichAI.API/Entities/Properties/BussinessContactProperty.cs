using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class BusinessContactProperty
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public ImageProperty ImageProperty { get; set; } = null!;
    }

    public class BusinessContactPersonInfoResponseDto
    {
        [Required(ErrorMessage = "Tên người liên hệ không được để trống.")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email người liên hệ không được để trống.")]
        [EmailFormat]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Số điện thoại không được để trống.")]
        public string PhoneNumber { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        [Required(ErrorMessage = "Avatar không được để trống.")]
        public string FileId { get; set; } = string.Empty;
    }
}