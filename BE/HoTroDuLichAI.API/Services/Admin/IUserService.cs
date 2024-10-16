using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IUserService
    {
        Task<ApiResponse<ResultMessage>> AddUserRolesAsync(AddUserRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateUserRolesAsync(UpdateUserRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> RemoveUserRolesAsync(RemoveUserRolesRequestDto requestDto,
            ModelStateDictionary? modelState = null);
    }
}