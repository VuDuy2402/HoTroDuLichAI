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
        None = 0,
        Room = 1,
        Food = 2,
        Drink = 3
    }
}