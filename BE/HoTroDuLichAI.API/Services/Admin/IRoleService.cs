
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IRoleService
    {
        Task<ApiResponse<ResultMessage>> CreateRolesAsync(CreateRolesRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteRolesAsync(DeleteRolesRequestDto requestDto);
        Task<ApiResponse<BasePagedResult<RoleDetailResponseDto>>> GetAllRolesAsync(RoleFilterParams param);
        Task<ApiResponse<RoleDetailResponseDto>> GetRoleByIdAsync(Guid roleId);
        Task<ApiResponse<ResultMessage>> UpdateRolesAsync(UpdateRolesRequestDto requestDto, ModelStateDictionary? modelState = null);
    }
}