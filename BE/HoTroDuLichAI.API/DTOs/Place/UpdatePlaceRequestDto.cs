namespace HoTroDuLichAI.API
{
    public class UpdatePlaceRequestDto
    {
        public Guid PlaceId { get; set; }
        public string Address { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public CPlaceType PlaceType { get; set; }
        public List<UpdateImageProperty> ImageFiles { get; set; } = new();
    }

    public class UpdateImageProperty
    {
        public string FileId { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

}