using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HoTroDuLichAI.API.Controllers
{
    [ApiController]
    [Route("/api/v1/report")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("basereport")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetBaseReport(ReportRequestDto requestDto)
        {
            var result = await _reportService.GetBaseReportAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

        [HttpPost("placetypeusereport")]
        [Authorize(Roles = RoleDescription.Admin)]
        public async Task<IActionResult> GetPlaceTypeUsedReport(ReportRequestDto requestDto)
        {
            var result = await _reportService.GetPlaceTypeUsedReportAsync(requestDto: requestDto);
            return StatusCode(statusCode: result.StatusCode, value: result.Result);
        }

    }
}