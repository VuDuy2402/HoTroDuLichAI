namespace HoTroDuLichAI.API
{
    public class AddUserRolesRequestDto
    {
        public Guid UserId { get; set; }
        public List<CRoleType> RoleTypes { get; set; } = new();
    }

    public class UpdateUserRolesRequestDto : AddUserRolesRequestDto
    {}

    public class RemoveUserRolesRequestDto : AddUserRolesRequestDto
    {}

    public class AddUserRolesResponseDto
    {

    }
}