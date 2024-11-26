namespace HoTroDuLichAI.API
{
    public class ApproveCreatePlaceRequestDto
    {
        public Guid PlaceId { get; set; }
        public CApprovalType Type { get; set; }
    }
}