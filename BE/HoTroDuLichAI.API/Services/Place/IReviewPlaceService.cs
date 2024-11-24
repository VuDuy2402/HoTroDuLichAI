using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IReviewPlaceService
    {
        Task<ApiResponse<BasePagedResult<ReviewPlaceDetailResponseDto>>> GetWithPagingAsync(
            ReviewPlacePagingAndFilterParam param, Guid? placeId = null, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ReviewPlaceDetailResponseDto>> GetReviewPlaceByIdAsync(Guid reviewPlaceId);
        Task<ApiResponse<ResultMessage>> CreateReviewPlaceAsync(CreateReviewPlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdateReviewPlaceAsync(UpdateReviewPlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeleteReviewPlaceAsyn(Guid reviewPlaceId);

        // Task<List<ReviewPlaceDto>> GetReviewPlaceByIdAsync(Guid placeId);
    }
}