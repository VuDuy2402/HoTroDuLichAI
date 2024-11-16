using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API
{
    [ApiController]
    [Route("/api/v1/itinerary")]
    public class ItineraryController : ControllerBase
    {
        private readonly IItineraryService _itineraryService;

        public ItineraryController(
            IItineraryService itineraryService
        )
        {
            _itineraryService = itineraryService;
        }

        [HttpPost("paging")]
        public async Task<IActionResult> GetWithPaging(ItineraryPagingAndFilterParam param)
        {
            var result = await _itineraryService.GetAllItinerariesAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("detailspaging")]
        public async Task<IActionResult> GetDetailsWithPaging(ItineraryPagingAndFilterParam param, Guid itineraryId)
        {
            var result = await _itineraryService.GetAllItineraryDetailsAync(param: param, itineraryId, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> GetDetailsById(Guid id)
        {
            var result = await _itineraryService.GetItineraryDetailsByIdAsync(id);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}