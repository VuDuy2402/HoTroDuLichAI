using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace HoTroDuLichAI.API
{
    // public class PasswordValidationAttribute : ValidationAttribute
    // {
    //     protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    //     {
    //         var password = value as string;
    //         if (string.IsNullOrEmpty(password))
    //         {
    //             return new ValidationResult("Password is required.");
    //         }

    //         // Example: Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
    //         var regex = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
    //         if (!regex.IsMatch(password))
    //         {
    //             return new ValidationResult("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
    //         }

    //         return ValidationResult.Success;
    //     }
    // }

    public class PasswordValidationAttribute : ValidationAttribute
    {
        public int MinimumLength { get; set; } = 8;
        public int MaximumLength { get; set; } = 50;
        public new string ErrorMessage { get; set; } = "Password must be between {0} and {1} characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.";

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var password = value as string;
            // if (string.IsNullOrEmpty(password))
            // {
            //     return new ValidationResult("Password is required.");
            // }

            if (password != null && (password.Length < MinimumLength || password.Length > MaximumLength))
            {
                return new ValidationResult(string.Format(ErrorMessage, MinimumLength, MaximumLength));
            }

            var regex = new Regex($@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{{{MinimumLength},{MaximumLength}}}$");
            if (password != null && !regex.IsMatch(password))
            {
                return new ValidationResult("Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
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
                // Cho phép trường mật khẩu để trống
                return ValidationResult.Success;
            }

            string password = value.ToString() ?? string.Empty;
            // Kiểm tra điều kiện mật khẩu mạnh
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