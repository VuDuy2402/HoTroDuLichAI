using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class UserDetailResponseDto
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public DateTimeOffset CreatedDate { get; set; }
        public bool ConfirmEmail { get; set; }
        public bool TwoFactorEnable { get; set; }
        public List<RoleDetailProperty> RoleDetailProperties { get; set; } = new();
    }

    public class RoleDetailProperty
    {
        public Guid RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public CRoleType RoleType { get; set; }
    }

    public class UpdateUserRequestDto
    {
        public Guid UserId { get; set; }
        [Required(ErrorMessage = "Họ tên không được để trống.")]
        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự.")]
        public string FullName { get; set; } = string.Empty;
        [MinAge(minAge: 8, ErrorMessage = "Người dùng phải lớn hơn 8 tuổi.")]
        public DateOnly? DateOfBirth { get; set; }

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự.")]
        public string Address { get; set; } = string.Empty;
        [PasswordType]
        public string? NewPassword { get; set; }
        public bool ConfirmEmail { get; set; }
        public bool TwoFactorEnable { get; set; }
        public List<Guid> RoleIds { get; set; } = new();
    }


    public class CreateUserRequestDto
    {
        [Required(ErrorMessage = "Họ tên không được để trống.")]
        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự.")]
        public string FullName { get; set; } = string.Empty;
        [EmailFormat]
        public string Email { get; set; } = string.Empty;
        [MinAge(minAge: 8, ErrorMessage = "Người dùng phải lớn hơn 8 tuổi.")]
        public DateOnly? DateOfBirth { get; set; }

        [StringLength(200, ErrorMessage = "Địa chỉ không được vượt quá 200 ký tự.")]
        public string Address { get; set; } = string.Empty;
        [Required(ErrorMessage = "Mật khẩu không được để trống.")]
        [PasswordType]
        public string Password { get; set; } = string.Empty;
        public bool ConfirmEmail { get; set; }
        public bool TwoFactorEnable { get; set; }
        public List<Guid> RoleIds { get; set; } = new();
    }
}