namespace HoTroDuLichAI.API
{
    public interface IReviewPlaceService
    {
        Task<List<ReviewPlaceDto>> GetReviewPlaceByIdAsync(Guid placeId);
    }
}