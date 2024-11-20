
namespace HoTroDuLichAI.API
{
    public class BusinessDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public CBusinessServiceType BusinssServiceType { get; set; }
        public CApprovalType Appoved { get; set; }
        public bool IsNew { get; set; }
        public string BusinessContactPerson { get; set; } = string.Empty;
        public BusinessContactProperty BusinessContactProperty { get; set; } = null!;
        public Guid UserId { get; set; }
        public virtual UserEntity User { get; set; } = null!;
        public virtual ICollection<BusinessAnalyticEntity> BusinessAnalytics { get; set; } = new List<BusinessAnalyticEntity>();
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();
    }
}