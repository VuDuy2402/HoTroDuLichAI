using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace HoTroDuLichAI.API
{
    public class EmailFormatAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
        {
            return new ValidationResult("Email không được để trống.");
        }

        string email = value.ToString() ?? string.Empty;
        var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        if (!regex.IsMatch(email))
        {
            return new ValidationResult("Email không đúng định dạng.");
        }

        return ValidationResult.Success;
    }
}
}