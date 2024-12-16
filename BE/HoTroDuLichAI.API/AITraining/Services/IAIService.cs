namespace HoTroDuLichAI.API
{
    public interface IAIService
    {
        Task<List<BusinessRoutePrediction>> GetBusinessRoute(Guid startProvinceId, Guid destinationPlaceId);
    }
}