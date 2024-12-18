using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class ComparePasswordsAttribute : ValidationAttribute
    {
        private readonly string _comparisonProperty;

        public ComparePasswordsAttribute(string comparisonProperty)
        {
            _comparisonProperty = comparisonProperty;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var currentValue = value as string;
            var property = validationContext.ObjectType.GetProperty(_comparisonProperty);
            if (property == null)
            {
                return new ValidationResult($"Unknown property: {_comparisonProperty}");
            }

            var comparisonValue = property.GetValue(validationContext.ObjectInstance) as string;

            if (currentValue != comparisonValue)
            {
                return new ValidationResult("Mật khẩu và xác nhận mật khẩu không khớp.");
            }

            return ValidationResult.Success;
        }
    }
}