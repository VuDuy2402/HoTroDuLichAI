using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    public class UpdateBusinessAnalyticRequestDto
    {
        public Guid Id { get; set; } 
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }
        public Guid BusinessId { get; set; }
    }
}