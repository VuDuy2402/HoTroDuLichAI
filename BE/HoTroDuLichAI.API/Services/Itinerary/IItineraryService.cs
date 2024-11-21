using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IItineraryService
    {
        Task<ApiResponse<BasePagedResult<ItineraryDto>>> GetAllItinerariesAsync(ItineraryPagingAndFilterParam param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<BasePagedResult<ItineraryDetailDto>>> GetAllItineraryDetailsAync(ItineraryPagingAndFilterParam param, Guid itineraryId, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ItineraryDto>> GetItineraryByIdAsync(Guid id);
        Task<ApiResponse<ItineraryDetailDto>> GetItineraryDetailsByIdAsync(Guid id);
        Task<ApiResponse<BasePagedResult<ItineraryInfoResponseDto>>> GetItinerarySuggestionAsync(Guid placeId, ItineraryPagingAndFilterParam param,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<List<ItineraryDetailResponseDto>>> GetItineraryDetailsByItineraryIdAsync(Guid itineraryId);
        Task<ApiResponse<ItineraryInfoResponseDto>> CreateItineraryAsync(CreateItineraryRequestDto requestDto,
            ModelStateDictionary? modelState = null);
    }
}