namespace HoTroDuLichAI.API
{
    public class ItineraryInfoResponseDto
    {
        public Guid ItineraryId { get; set; }
        public Guid PlaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTimeOffset CreatedDate { get; set; }
        public int TotalDay { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalUse { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
    }

    
}