using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IBusinessAnalyicService
    {
        Task<ApiResponse<BusinessAnylyticResponseDto>> GetBusinessAnalysicDetailByIdAsync(Guid analyticId);
        Task<ApiResponse<BusinessAnylyticResponseDto>> CreateBusinessAnalyticAsync(CreateBusinessAnalyticRequestDto requestDto, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateBusinessAnalysicAsync(UpdateBusinessAnalyticRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteBusinessAnalysicAsync(Guid analyticId);
        
    }
}