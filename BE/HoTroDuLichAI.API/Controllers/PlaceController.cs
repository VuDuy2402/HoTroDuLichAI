using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API
{
    [ApiController]
    [Route("/api/v1/admin/place")]
    public class PlaceController : ControllerBase
    {
        private readonly IPlaceService _placeService;

        public PlaceController(
            IPlaceService placeService
        )
        {
            _placeService = placeService;
        }

        [HttpPost("paging")]
        public async Task<IActionResult> GetWithPaging(PlacePagingAndFilterParams param)
        {
            var result = await _placeService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("newplace/paging")]
        public async Task<IActionResult> GetNewPlaceWithPaging(PlacePagingAndFilterParams param)
        {
            param.IsNew = true;
            var result = await _placeService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/paging")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetWithPagingManage(PlacePagingAndFilterParams param)
        {
            param.IsAdmin = true;
            var result = await _placeService.GetWithPagingAsync(param: param, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
        
        [HttpGet("manage/{placeId}")]
        public async Task<IActionResult> GetPlaceById(Guid placeId)
        {
            var result = await _placeService.GetPlaceDetailByIdAsync(placeId: placeId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> CreatePlace(CreatePlaceRequestDto requestDto)
        {
            var result = await _placeService.CreatePlaceAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("manage")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> UpdatePlace(UpdatePlaceRequestDto requestDto)
        {
            var result = await _placeService.UpdatePlaceAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("{placeId}")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> DeletePlace(Guid placeId)
        {
            var result = await _placeService.DeletePlaceAsync(placeId: placeId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("manage/images/delete")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> DeletePlace(DeletePlaceImagesRequestDto requestDto)
        {
            var result = await _placeService.DeletePlaceImagesAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}