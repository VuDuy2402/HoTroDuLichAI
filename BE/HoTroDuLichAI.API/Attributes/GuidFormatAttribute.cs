using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class GuidFormatAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is string stringValue && Guid.TryParse(stringValue, out _))
            {
                return ValidationResult.Success;
            }
            return new ValidationResult("Trường phải là GUID hợp lệ.");
        }
    }
}