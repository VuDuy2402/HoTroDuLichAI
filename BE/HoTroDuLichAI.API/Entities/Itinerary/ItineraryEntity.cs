using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Customer_Itinerary")]
    public class ItineraryEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public int TotalUse { get; set; }
        public decimal TotalAmount { get; set; }
        public int TotalDay { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public DateTimeOffset? UpdatedDate { get; set; }

        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Itineraries")]
        public virtual UserEntity User { get; set; } = null!;

        public Guid? ProvinceId { get; set; }
        [ForeignKey(name: "ProvinceId")]
        [InverseProperty(property: "Itineraries")]
        public virtual ProvinceEntity? Province { get; set; }

        [InverseProperty("Itinerary")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();

    }
}