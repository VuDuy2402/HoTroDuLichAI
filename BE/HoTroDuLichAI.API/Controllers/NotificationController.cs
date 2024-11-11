using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(
            INotificationService notificationService
        )
        {
            _notificationService = notificationService;
        }
        
        [HttpPost("paging")]
        [Authorize]
        public async Task<IActionResult> GetWithPaging(NotificationPagingAndFilterParam param)
        {
            var result = await _notificationService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("countunread")]
        [Authorize]
        public async Task<IActionResult> CountNotificationUnRead()
        {
            ApiResponse<int> result = await _notificationService.CountNotificationUnReadAsync();
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}