using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Customer_ItineraryDetail")]
    public class ItineraryDetailEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int Index { get; set; }
        public TimeOnly Time { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public List<Guid> BusinessServiceIds { get; set; } = new();
        public Guid BusinessId { get; set; }
        [ForeignKey("BusinessId")]
        [InverseProperty("ItineraryDetails")]
        public virtual BusinessEntity Business { get; set; } = null!;

        public Guid ItineraryId { get; set; }
        [ForeignKey(name: "ItineraryId")]
        [InverseProperty(property: "ItineraryDetails")]
        public virtual ItineraryEntity Itinerary { get; set; } = null!;

        public Guid PlaceId { get; set; }
        [ForeignKey(name: "PlaceId")]
        [InverseProperty(property: "ItineraryDetails")]
        public virtual PlaceEntity Place { get; set; } = null!;
    }
}