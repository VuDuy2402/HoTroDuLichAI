using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Business_Business")]
    public class BusinessEntity
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
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
        #endregion inverse property
    }



}