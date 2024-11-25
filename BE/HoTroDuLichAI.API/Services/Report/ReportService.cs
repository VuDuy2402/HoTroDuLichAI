using Microsoft.AspNetCore.Identity;

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

        // public async Task<ApiResponse<>>



        #region Base logic
        private ApiResponse<T>? GetReportError<T>(ReportRequestDto requestDto)
        {
            var errors = new List<ErrorDetail>();
            var response = new ApiResponse<T>();
            if (requestDto == null)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Dữ liệu gửi về không hợp lệ. Vui lòng kiểm tra lại.",
                    ErrorScope = CErrorScope.FormSummary
                });
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            if (requestDto.FromDate > DateTimeOffset.UtcNow)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày bắt đầu phải nhỏ hơn hiện tại.",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.FromDate)}_Error"
                });
            }
            if (requestDto.ToDate > DateTimeOffset.UtcNow)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày kết thúc phải nhỏ hơn hiện tại",
                    ErrorScope = CErrorScope.Field,
                    Field = $"{nameof(requestDto.ToDate)}_Error"
                });
            }
            if (requestDto.FromDate > requestDto.ToDate)
            {
                errors.Add(new ErrorDetail()
                {
                    Error = $"Ngày bắt đầu không thể lớn hơn ngày kết thúc.",
                    ErrorScope = CErrorScope.FormSummary
                });
            }
            if (!errors.IsNullOrEmpty())
            {
                response.Result.Errors.AddRange(errors);
                response.Result.Success = false;
                response.StatusCode = StatusCodes.Status400BadRequest;
                return response;
            }
            return null;
        }
        #endregion Base logic
        
    }
}