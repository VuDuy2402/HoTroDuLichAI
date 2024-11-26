using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    public class CreateBusinessAnalyticRequestDto
    {
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }
        public Guid BusinessId { get; set; }
    }
}