
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace HoTroDuLichAI.API
{
    public class ReviewPlaceSerice : IReviewPlaceService
    {
        private readonly HoTroDuLichAIDbContext _dbContext;
        private readonly ILogger<PlaceService> _logger;

        public ReviewPlaceSerice
        (
                    HoTroDuLichAIDbContext dbContext,
                    ILogger<PlaceService> logger
        )
        {
            _dbContext = dbContext;
            _logger = logger;

        }
        public async Task<List<ReviewPlaceDto>> GetReviewPlaceByIdAsync(Guid placeId)
        {
            var result = await _dbContext.ReviewPlaces.Where(x => x.PlaceId == placeId).ToListAsync();
            if (result.IsNullOrEmpty())
            {
                _logger.LogWarning("No review exist for PlaceId: ", placeId);
                return new List<ReviewPlaceDto>();
            }
            return result.Adapt<List<ReviewPlaceDto>>();
        }
    }

}