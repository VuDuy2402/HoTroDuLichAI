using System.ComponentModel.DataAnnotations;
using HoTroDuLichAI.API;

namespace HoTroDuLichAI.API
{
    public class LoginRequestDto
    {
        [EmailAddress(ErrorMessage = "{0} is invalid email format.")]
        public string Email { get; set; } = string.Empty;
        [PasswordValidation(MinimumLength = 8, MaximumLength = 50)]
        public string Password { get; set; } = string.Empty;
    }
}