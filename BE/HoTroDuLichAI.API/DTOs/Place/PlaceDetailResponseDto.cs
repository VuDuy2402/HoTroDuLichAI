
using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class PlaceDetailResponseDto
    {
        public Guid PlaceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public int TotalView { get; set; }
        public int Rating { get; set; }
        public CPlaceType PlaceType { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
        public CApprovalType ApprovalType { get; set; }
        public OwnerProperty OwnerProperty { get; set; } = null!;
        public DateTimeOffset CreatedDate { get; set; }
        [JsonIgnore]
        public double Score { get; set; }
    }

    public class PlaceMoreInfoResponseDto : PlaceDetailResponseDto
    {
        public List<ImageDetailProperty> ImageDetailProperties { get; set; } = new List<ImageDetailProperty>();
        public int TotalReview { get; set; }
        public int TotalUseItinerary { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

    }

    public class ImageDetailProperty
    {
        public string FileId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public CImageType Type { get; set; }
        public bool IsDefault { get; set; }
    }
}