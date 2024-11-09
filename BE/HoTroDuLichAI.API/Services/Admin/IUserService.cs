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
        Task<ApiResponse<List<UserChatBaseInfo>>> GetUserAdminInfosAsync();


        Task<ApiResponse<BasePagedResult<UserDetailResponseDto>>> GetWithPagingAsync(UserFilterParams param,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<UserDetailResponseDto>> GetByIdAsync(Guid userId);
        Task<ApiResponse<ResultMessage>> DeleteAsync(Guid userId);
        Task<ApiResponse<UserDetailResponseDto>> UpdateAsync(UpdateUserRequestDto updateUserDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> CreateUserAsync(CreateUserRequestDto requestDto,
            ModelStateDictionary? modelState = null);
    }
}