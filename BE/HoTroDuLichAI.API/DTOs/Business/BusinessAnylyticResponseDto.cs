using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    public class BusinessAnylyticResponseDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }
        public Guid BusinessId { get; set; }
    }
}