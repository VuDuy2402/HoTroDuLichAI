namespace HoTroDuLichAI.API
{
    public class CreatePlaceRequestDto
    {
        public string Address { get; set; } = string.Empty;
        public bool IsNew { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public CPlaceType PlaceType { get; set; }
        public List<string> FileIds { get; set; } = new();
    }
}