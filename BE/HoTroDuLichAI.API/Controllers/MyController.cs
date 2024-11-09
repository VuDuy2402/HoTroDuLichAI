using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/me")]
    public class MyController : ControllerBase
    {
        private readonly IMyService _myService;
        public MyController(IMyService myService)
        {
            _myService = myService;
        }

        [HttpGet("mybaseprofile")]
        [Authorize]
        public async Task<IActionResult> GetMyBaseProfile()
        {
            var result = await _myService.GetMyBaseProfileAsync();
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("myprofile")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _myService.GetMyProfileAsync();
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("myprofile/updateimage")]
        [Authorize]
        public async Task<IActionResult> UpdateMyImages(UpdateMyImageRequestDto requestDto)
        {
            var result = await _myService.UpdateMyImagesAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPut("myprofile")]
        [Authorize]
        public async Task<IActionResult> UpdateMyProfile(UpdateMyProfileRequestDto requestDto)
        {
            var result = await _myService.UpdateMyProfileAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}