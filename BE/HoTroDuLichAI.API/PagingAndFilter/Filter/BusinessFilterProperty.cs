namespace HoTroDuLichAI.API
{
    public class BusinessFilterProperty
    {
        public CApprovalType? ApprovalType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }
        public CBusinessServiceType? BusinessServiceType{ get; set; }
    }
}