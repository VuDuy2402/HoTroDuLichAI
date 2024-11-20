using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IPlaceService
    {
        Task<ApiResponse<BasePagedResult<PlaceDetailResponseDto>>> GetWithPagingAsync(
            PlacePagingAndFilterParams param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<PlaceMoreInfoResponseDto>> GetPlaceDetailByIdAsync(Guid placeId);
        Task<ApiResponse<PlaceDetailResponseDto>> CreatePlaceAsync(CreatePlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> UpdatePlaceAsync(UpdatePlaceRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<ResultMessage>> DeletePlaceAsync(Guid placeId);
        Task<ApiResponse<ResultMessage>> DeletePlaceImagesAsync(DeletePlaceImagesRequestDto requestDto,
            ModelStateDictionary? modelState = null);
    }
}