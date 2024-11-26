namespace HoTroDuLichAI.API
{
    public class ApproveNewBusinessRequestDto
    {
        public Guid BusinessId { get; set; }
        public CApprovalType ApprovalType { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}