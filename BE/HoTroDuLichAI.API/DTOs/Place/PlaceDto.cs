
namespace HoTroDuLichAI.API
{
    public class PlaceDto
    {
        public Guid Id { get; set; } 
        public string Name { get; set; } 
        public int Rating { get; set; }
        public int TotalView { get; set; }
        public string Description { get; set; } 
        public string Address { get; set; } 
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Thumbnail { get; set; } 
        public CPlaceType PlaceType { get; set; }
        public bool IsNew { get; set; }
        public CApprovalType Appoved { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public string ImageGallery { get; set; }
        public List<ImageProperty> ImageProperties {get; set;}
        public Guid UserId { get; set; }
        public UserEntity User { get; set; }

        public ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; }

        public ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; }
    }
}