namespace HoTroDuLichAI.API
{
    public class RoleDetailResponseDto
    {
        public Guid RoleId { get; set; } 
        public string RoleName { get; set; } = string.Empty;
        public CRoleType Type { get; set; }
        public string ConcurrencyStamp { get; set; } = string.Empty;
    }
    public class CreateRolesRequestDto
    {
        public List<CRoleType> RoleTypes { get; set; } = new();
    }

    public class UpdateRolesRequestDto
    {
        public List<RoleProperty> RoleProperties { get; set; } = new();
    }
    

    public class RoleProperty
    {
        public Guid Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public CRoleType Type { get; set; }
    }

    public class DeleteRolesRequestDto
    {
        public List<Guid> RoleIds { get; set; } = new();
    }
}