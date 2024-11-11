namespace HoTroDuLichAI.API
{
    public class PlaceFilterProperty
    {
        public CApprovalType? ApprovalType { get; set; }
        public CPlaceType? PlaceType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }
    }
}