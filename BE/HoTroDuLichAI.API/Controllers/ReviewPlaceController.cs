using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/place/reviewplace")]
    public class ReviewPlaceController : ControllerBase
    {
        private readonly IReviewPlaceService _reviewPlaceService;

        public ReviewPlaceController(IReviewPlaceService reviewPlaceService)
        {
            _reviewPlaceService = reviewPlaceService;
        }

        [HttpPost("manage/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetWithPagingAdmin(ReviewPlacePagingAndFilterParam param)
        {
            param.IsAdmin = true;
            var result = await _reviewPlaceService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("my/paging")]
        [Authorize(Roles = RoleDescription.NormalUser)]
        public async Task<IActionResult> GetWithPagingMy(ReviewPlacePagingAndFilterParam param)
        {
            param.IsMy = true;
            var result = await _reviewPlaceService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("{placeId}/paging")]
        public async Task<IActionResult> GetWithPaging(Guid placeId, ReviewPlacePagingAndFilterParam param)
        {
            param.IsPlace = true;
            var token = Request.Headers["Authorization"].ToString();
            var result = await _reviewPlaceService.GetWithPagingAsync(param: param, placeId: placeId, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("{reviewPlaceId}")]
        public async Task<IActionResult> GetReviewPlaceById(Guid reviewPlaceId)
        {
            var result = await _reviewPlaceService.GetReviewPlaceByIdAsync(reviewPlaceId: reviewPlaceId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReviewPlace(CreateReviewPlaceRequestDto requestDto)
        {
            var result = await _reviewPlaceService.CreateReviewPlaceAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateReviewPlace(UpdateReviewPlaceRequestDto requestDto)
        {
            var result = await _reviewPlaceService.UpdateReviewPlaceAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("{reviewPlaceId}")]
        [Authorize]
        public async Task<IActionResult> DeleteReviewPlace(Guid reviewPlaceId)
        {
            var result = await _reviewPlaceService.DeleteReviewPlaceAsyn(reviewPlaceId: reviewPlaceId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}