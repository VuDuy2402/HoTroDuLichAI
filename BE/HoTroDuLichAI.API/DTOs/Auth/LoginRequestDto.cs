namespace HoTroDuLichAI.API
{
    public class LoginRequestDto
    {
        [EmailFormat]
        public string Email { get; set; } = string.Empty;
        [PasswordValidation(MinimumLength = 8, MaximumLength = 50)]
        public string Password { get; set; } = string.Empty;
    }
}