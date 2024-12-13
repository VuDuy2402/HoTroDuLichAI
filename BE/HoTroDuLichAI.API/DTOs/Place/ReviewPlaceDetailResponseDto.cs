namespace HoTroDuLichAI.API
{
    public class ReviewPlaceDetailResponseDto
    {
        public Guid ReviewPlaceId { get; set; }
        public Guid PlaceId { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
        public float Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTimeOffset CreatedDate { get; set; }
        public bool IsOwner { get; set; }
    }
}