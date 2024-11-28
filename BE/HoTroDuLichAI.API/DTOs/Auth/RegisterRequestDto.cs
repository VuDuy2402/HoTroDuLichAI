using System.ComponentModel.DataAnnotations;
using HoTroDuLichAI.API;

namespace HoTroDuLichAI.API
{
    public class RegisterRequestDto
    {
        [Required(ErrorMessage = "Họ tên không được để trống.")]
        public string FullName { get; set; } = string.Empty;
        [EmailFormat]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [PasswordValidation(MinimumLength = 8, MaximumLength = 50)]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "Xác nhận lại mật khẩu không được để trống.")]
        [PasswordValidation(MinimumLength = 8, MaximumLength = 50)]
        [ComparePasswords(nameof(RegisterRequestDto.Password), ErrorMessage = "Xác nhận mật khẩu không khớp.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}