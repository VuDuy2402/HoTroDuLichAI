using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ReportService : IReportService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;
        private readonly ILogger<ReportService> _logger;

        public ReportService(
            HoTroDuLichAIDbContext dbContext,
            UserManager<UserEntity> userManager,
            ILogger<ReportService> logger)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<ApiResponse<BaseReportResponseDto>> GetBaseReportAsync(ReportRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<BaseReportResponseDto>();
            var reportResponseError = ErrorHelper.GetReportError<BaseReportResponseDto>(requestDto: requestDto);
            if (reportResponseError != null)
            {
                return reportResponseError;
            }
            try
            {
                var newBusinessCount = await _dbContext.Businesses.Where(b => b.CreatedDate >= requestDto.FromDate && b.CreatedDate <= requestDto.ToDate).CountAsync();
                var newArticleCount = await _dbContext.Articles.Where(b => b.CreatedDate >= requestDto.FromDate && b.CreatedDate <= requestDto.ToDate).CountAsync();
                var newUserCount = await _dbContext.Users.Where(u => u.CreatedDate <= requestDto.ToDate && u.CreatedDate >= requestDto.FromDate).CountAsync();
                var newPlaceCount = await _dbContext.Places.Where(u => u.CreatedDate >= requestDto.FromDate && u.CreatedDate <= requestDto.ToDate).CountAsync();
                var newItineraryCount = await _dbContext.Itineraries.Where(it => it.CreatedDate >= requestDto.FromDate && it.CreatedDate <= requestDto.ToDate).CountAsync();
                response.Result.Data = new BaseReportResponseDto()
                {
                    NewArticleCount = newArticleCount,
                    NewBusinessCount = newBusinessCount,
                    NewPlaceCount = newPlaceCount,
                    NewUserCount = newUserCount
                };
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        public async Task<ApiResponse<List<PlaceTypeReportResponseDto>>> GetPlaceTypeUsedReportAsync(ReportRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<List<PlaceTypeReportResponseDto>>();
            var reportResponseError = ErrorHelper.GetReportError<List<PlaceTypeReportResponseDto>>(requestDto: requestDto);
            if (reportResponseError != null)
            {
                return reportResponseError;
            }
            try
            {
                var placeTypes = await _dbContext.Places.Where(pl => pl.CreatedDate >= requestDto.FromDate && pl.CreatedDate <= requestDto.ToDate)
                    .GroupBy(pl => pl.PlaceType)
                    .Select(pl => new {
                        PlaceType = pl.Key,
                        TotalUse = pl.Count()
                    }).ToListAsync();
                response.Result.Data = placeTypes.Select(pt => new PlaceTypeReportResponseDto()
                {
                    PlaceTypeName = pt.PlaceType.ToDescription(),
                    TotalUseCount = pt.TotalUse
                }).ToList();
                response.Result.Success = true;
                response.StatusCode = StatusCodes.Status200OK;
                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return await ResponseHelper.InternalServerErrorAsync(errors: errors, response: response, ex: ex);
            }
        }

        // public async Task<ApiResponse<>> Get
    }
}