using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public class BusinessServiceProperty
    {
        public Guid ServiceId { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public CBusinessServiceStatus Status { get; set; }
        public CBusinessServiceType Type { get; set; }
        public decimal Amount { get; set; }
        public int Quantity { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
    }


    public enum CBusinessServiceStatus
    {
        None = 0,
        Available = 1,
        NotAvailable = 2
    }

    public enum CBusinessServiceType
    {
        [Description("Không xác định")]
        None = 0,
        [Description("Khách sạn")]
        Hotel = 1,
        [Description("Khu nghỉ dưỡng")]
        Villa = 2,
        [Description("Nhà hàng")]
        Restaurant = 3
    }
}