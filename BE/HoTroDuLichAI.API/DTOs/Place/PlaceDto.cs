
namespace HoTroDuLichAI.API
{
    public class PlaceDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Rating { get; set; }
        public int TotalView { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public CPlaceType PlaceType { get; set; }
        public bool IsNew { get; set; }
        public CApprovalType Appoved { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public string ImageGallery { get; set; } = string.Empty;
        public List<ImageProperty> ImageProperties { get; set; } = new();
        public Guid UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        public ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();

        public ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; } = new List<ReviewPlaceEntity>();
    }
}