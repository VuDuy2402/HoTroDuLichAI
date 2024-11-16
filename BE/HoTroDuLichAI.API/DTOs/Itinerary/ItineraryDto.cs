namespace HoTroDuLichAI.API
{
    public class ItineraryDto 
    {
        public Guid Id { get; set; } 
         public string Name { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
        public UserEntity User { get; set; } = null;
        public ICollection<ItineraryDetailDto> ItineraryDetails { get; set; } = null;

    }
}