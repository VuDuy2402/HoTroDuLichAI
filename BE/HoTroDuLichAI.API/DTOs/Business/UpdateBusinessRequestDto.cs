namespace HoTroDuLichAI.API
{
    public class UpdateBusinessRequestDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public string BusinessContactPerson { get; set; } = string.Empty;
        public BusinessContactPropertyDto BusinessContactProperty { get; set; } = null!;
    }
}