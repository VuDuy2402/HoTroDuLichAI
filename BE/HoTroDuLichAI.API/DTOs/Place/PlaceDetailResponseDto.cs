
namespace HoTroDuLichAI.API
{
    public class PlaceDetailResponseDto
    {
        public Guid PlaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        public long Latitude { get; set; }
        public long Longtitude { get; set; }
        public int TotalView { get; set; }
        public int Rating { get; set; }
        public CPlaceType PlaceType { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public CApprovalType ApprovalType { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
    }
}