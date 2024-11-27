namespace HoTroDuLichAI.API
{
    public class BaseReportResponseDto
    {
        public int NewBusinessCount { get; set; }
        public int NewUserCount { get; set; }
        public int NewArticleCount { get; set; }
        public int NewPlaceCount { get; set; }
        public int NewItineraryCount { get; set; }
    }

    public class BusinessViewContactReportResponseDto
    {
        public Guid BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public int TotalView { get; set; }
        public int TotalContact { get; set; }
        public decimal TotalAmount { get; set; }
    }

    public class BusinessServiceUsedReportResponseDto
    {
        public Guid ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public int TotalUse { get; set; }
    }

    public class PlaceTypeReportResponseDto
    {
        public string PlaceTypeName { get; set; } = string.Empty;
        public int TotalUseCount { get; set; }
    }
}