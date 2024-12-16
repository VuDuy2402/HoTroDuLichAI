using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/ai")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aIService;

        public AIController(IAIService aIService)
        {
            _aIService = aIService;
        }

        [HttpPost("business/suggestion")]
        public async Task<IActionResult> GetBusinessSuggestion(Guid placeId, Guid provinceId)
        {
            var result = await _aIService.GetBusinessRoute(startProvinceId: provinceId, destinationPlaceId: placeId);
            return Ok(result);
        }
    }
}