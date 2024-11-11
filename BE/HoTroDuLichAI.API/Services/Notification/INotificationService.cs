using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface INotificationService
    {
        Task<ApiResponse<int>> CountNotificationUnReadAsync();
        Task<ApiResponse<BasePagedResult<NotificationDetailResponseDto>>> GetWithPagingAsync(
            NotificationPagingAndFilterParam param, ModelStateDictionary? modelState = null);
    }
}