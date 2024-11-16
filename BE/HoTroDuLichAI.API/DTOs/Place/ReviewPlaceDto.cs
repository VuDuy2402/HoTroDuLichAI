namespace HoTroDuLichAI.API
{
    public class ReviewPlaceDto
    {
        public Guid Id { get; set; }
        public long Rating { get; set; }
        public string Comment { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public Guid UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        public Guid PlaceId { get; set; }
        public PlaceEntity Place { get; set; } = null!;
    }
}