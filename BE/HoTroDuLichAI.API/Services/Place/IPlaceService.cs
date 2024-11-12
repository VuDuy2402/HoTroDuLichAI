using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IPlaceService
    {
        Task<ApiResponse<BasePagedResult<PlaceDetailResponseDto>>> GetWithPagingAsync(
            PlacePagingAndFilterParams param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<PlaceMoreInfoResponseDto>> GetPlaceDetailByIdAsync(Guid placeId);
    }
}