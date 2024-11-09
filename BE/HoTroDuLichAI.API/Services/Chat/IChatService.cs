using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace HoTroDuLichAI.API
{
    public interface IChatService
    {
        Task<ApiResponse<List<MessageDetailResponseDto>>> GetMyConversationsAsync(GetMessageChatRequestDto requestDto,
            ModelStateDictionary? modelState = null);
        Task<ApiResponse<bool>> SendMessageAsync(SendMessageRequestDto requestDto,
            ModelStateDictionary? modelState = null);
    }
}