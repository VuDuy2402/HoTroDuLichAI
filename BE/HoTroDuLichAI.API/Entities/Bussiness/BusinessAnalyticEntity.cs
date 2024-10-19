using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Business_BusinessAnalytic")]
    public class BusinessAnalyticEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }
        public Guid BusinessId { get; set; }
        [ForeignKey(name: "BusinessId")]
        [InverseProperty(property: "BusinessAnalytics")]
        public virtual BusinessEntity Business { get; set; } = null!;
    }
}