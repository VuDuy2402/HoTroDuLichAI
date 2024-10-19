using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "Admin_Place")]
    public class PlaceEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public long Latitude { get; set; }
        public long Longtitude { get; set; }
        public CPlaceType PlaceType { get; set; }
        public bool IsNew { get; set; }
        public bool Appoved { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        #region inverse property
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty("Places")]
        public virtual UserEntity User { get; set; } = null!;

        [InverseProperty(property: "Place")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();

        [InverseProperty(property: "Place")]
        public virtual ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; } = new List<ReviewPlaceEntity>();
        #endregion
    }
}