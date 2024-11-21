using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Business_Business")]
    public class BusinessEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        [NotMapped]
        public BusinessServiceProperty ServiceProperty { get; set; } = null!;
        public CBusinessServiceType BusinessServiceType { get; set; }
        public CApprovalType Appoved { get; set; }
        public bool IsNew { get; set; }
        public string BusinessContactPerson { get; set; } = string.Empty;
        [NotMapped]
        public BusinessContactProperty BusinessContactProperty { get; set; } = null!;

        #region inverse property
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Businesses")]
        public virtual UserEntity User { get; set; } = null!;

        [InverseProperty(property: "Business")]
        public virtual ICollection<BusinessAnalyticEntity> BusinessAnalytics { get; set; } = new List<BusinessAnalyticEntity>();
        [InverseProperty(property: "Business")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();
        #endregion inverse property
    }
}