namespace HoTroDuLichAI.API
{
    public class UpdateBusinessRequestDto
    {
        public Guid BusinessId { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public BusinessServiceProperty BusinessServiceProperty { get; set; } = new BusinessServiceProperty();
        public BusinessContactProperty BusinessContactProperty { get; set; } = null!;
        public string FileId { get; set; }  = string.Empty;
    }
}