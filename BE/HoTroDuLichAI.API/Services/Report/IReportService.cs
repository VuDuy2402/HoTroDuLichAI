namespace HoTroDuLichAI.API
{
    public interface IReportService
    {
        Task<ApiResponse<BaseReportResponseDto>> GetBaseReportAsync(ReportRequestDto requestDto);
        Task<ApiResponse<List<PlaceTypeReportResponseDto>>> GetPlaceTypeUsedReportAsync(ReportRequestDto requestDto);
    }
}