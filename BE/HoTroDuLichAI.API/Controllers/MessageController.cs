using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("api/v1/chat")]
    public class MessageController : ControllerBase
    {
        private readonly IChatService _chatService;

        public MessageController(
            IChatService chatService
        )
        {
            _chatService = chatService;
        }

        [HttpPost("sendmessage")]
        [Authorize]
        public async Task<IActionResult> SendMessage(SendMessageRequestDto requestDto)
        {
            ApiResponse<bool> result = await _chatService.SendMessageAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("getmyconversation")]
        [Authorize]
        public async Task<IActionResult> GetMyConversations(GetMessageChatRequestDto requestDto)
        {
            ApiResponse<List<MessageDetailResponseDto>> result = await _chatService.GetMyConversationsAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}