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

        // public async Task<ApiResponse<BusinessReportResponseDto>> GetBusinessReportByBusinessId()
        // {

        // }

        
    }
}