namespace HoTroDuLichAI.API
{
    public class DeletePlaceImagesRequestDto
    {
        public Guid PlaceId { get; set; }
        public List<string> FileIds { get; set; } = new();
    }
}