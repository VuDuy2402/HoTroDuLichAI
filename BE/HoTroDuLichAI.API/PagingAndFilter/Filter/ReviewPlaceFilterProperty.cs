namespace HoTroDuLichAI.API
{
    public class ReviewPlaceFilterProperty
    {
        public long? FromRating { get; set; }
        public long? ToRating { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }
    }
}