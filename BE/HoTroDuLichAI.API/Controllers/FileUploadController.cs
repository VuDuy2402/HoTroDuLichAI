using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/cet/fileupload")]
    public class FileUploadController : ControllerBase
    {
        private readonly IImageKitIOService _imageKitIOService;
        public FileUploadController(
            IImageKitIOService imageKitIOService
        )
        {
            _imageKitIOService = imageKitIOService;
        }

        [HttpGet("imagekit/auth")]
        public async Task<IActionResult> GetImageKitAuth()
        {
            var result = await _imageKitIOService.GetAuthAsync();
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpGet("imagekit/{fileId}")]
        public async Task<IActionResult> GetImageKitFileDetail(string fileId)
        {
            var result = await _imageKitIOService.GetFileDetailsAsync(fileId: fileId);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }


        [HttpPost("imagekit/bulkupload")]
        public async Task<IActionResult> UploadFilesWithImageKit(ImageKitUploadRequestDto requestDto)
        {
            var result = await _imageKitIOService.BulkUploadFilesAsync(requestDto: requestDto, modelState: ModelState);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpDelete("imagekit/bulkdelete")]
        [Authorize]
        public async Task<IActionResult> BulkDeleteImageFiles(ImageKitDeleteRequestDto requestDto)
        {
            var result = await _imageKitIOService.BulkDeleteFilesAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }
    }
}