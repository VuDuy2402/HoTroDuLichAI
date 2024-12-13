namespace HoTroDuLichAI.API
{
    public class CreateReviewPlaceRequestDto
    {
        public string Comment { get; set; } = string.Empty;
        public long Rating { get; set; }
        public Guid PlaceId { get; set; }
    }

    public class UpdateReviewPlaceRequestDto : CreateReviewPlaceRequestDto
    {
        public Guid ReviewPlaceId { get; set; }
    }
}