using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IItineraryService
    {
        Task<ApiResponse<BasePagedResult<ItineraryDto>>> GetAllItinerariesAsync(ItineraryPagingAndFilterParam param, ModelStateDictionary? modelState = null);
        Task<ApiResponse<BasePagedResult<ItineraryDetailDto>>> GetAllItineraryDetailsAync(ItineraryPagingAndFilterParam param, Guid itineraryId, ModelStateDictionary? modelState = null);
        Task<ApiResponse<ItineraryDto>> GetItineraryByIdAsync(Guid id);
        Task<ApiResponse<ItineraryDetailDto>> GetItineraryDetailsByIdAsync(Guid id);
    }
}