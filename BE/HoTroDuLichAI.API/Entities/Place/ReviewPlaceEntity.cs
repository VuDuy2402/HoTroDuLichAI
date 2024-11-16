using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Customer_ReviewPlace")]
    public class ReviewPlaceEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public long Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        private DateTimeOffset _createdDate { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            set => _createdDate = value;
        }

        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "ReviewPlaces")]
        public virtual UserEntity User { get; set; } = null!;

        public Guid PlaceId { get; set; }
        [ForeignKey(name: "PlaceId")]
        [InverseProperty(property: "ReviewPlaces")]
        public virtual PlaceEntity Place { get; set; } = null!;
    }
}