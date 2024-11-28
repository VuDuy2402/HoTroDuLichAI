using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace HoTroDuLichAI.API
{
    public class PasswordValidationAttribute : ValidationAttribute
    {
        public int MinimumLength { get; set; } = 8;
        public int MaximumLength { get; set; } = 50;
        public new string ErrorMessage { get; set; } = "Mật khẩu phải dài từ {0} đến {1} ký tự, chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.";

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var password = value as string;
            if (password != null && (password.Length < MinimumLength || password.Length > MaximumLength))
            {
                return new ValidationResult(string.Format(ErrorMessage, MinimumLength, MaximumLength));
            }

            var regex = new Regex($@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{{{MinimumLength},{MaximumLength}}}$");
            if (password != null && !regex.IsMatch(password))
            {
                return new ValidationResult("Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt.");
            }

            return ValidationResult.Success;
        }
    }


    public class PasswordTypeAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success;
            }

            string password = value.ToString() ?? string.Empty;
            var hasMinimum8Chars = new Regex(@".{8,}").IsMatch(password);
            var hasUpperChar = new Regex(@"[A-Z]").IsMatch(password);
            var hasLowerChar = new Regex(@"[a-z]").IsMatch(password);
            var hasNumericChar = new Regex(@"[0-9]").IsMatch(password);
            var hasSpecialChar = new Regex(@"[!@#$%^&*(),.?""':{}|<>]").IsMatch(password);

            if (!hasMinimum8Chars || !hasUpperChar || !hasLowerChar || !hasNumericChar || !hasSpecialChar)
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 8 ký tự và chứa chữ hoa, chữ thường, số và ký tự đặc biệt.");
            }

            return ValidationResult.Success;
        }
    }
}