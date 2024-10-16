using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class MinAgeAttribute : ValidationAttribute
    {
        private readonly int _minAge;

        public MinAgeAttribute(int minAge)
        {
            _minAge = minAge;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is DateOnly dateOfBirth)
            {
                var today = DateTime.Today;
                var dateOfBirthDateTime = dateOfBirth.ToDateTime(TimeOnly.MinValue);
                var age = today.Year - dateOfBirthDateTime.Year;

                if (dateOfBirthDateTime.AddYears(age) > today)
                {
                    age--;
                }

                if (age < _minAge)
                {
                    return new ValidationResult(ErrorMessage);
                }
            }

            return ValidationResult.Success;
        }
    }
}