using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IBusinessService
    {
        Task<ApiResponse<BasePagedResult<BusinessDetailResponseDto>>> GetWithPagingAsync(BusinessPagingAndFilterParams param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<BusinessMoreInfoResponseDto>> GetBusinessDetailByIdAsync(Guid businessId);
        Task<ApiResponse<BusinessDetailResponseDto>> CreateBusinessAsync(CreateBusinessRequestDto requestDto, ModelStateDictionary? modelState = null);
    }
}