namespace HoTroDuLichAI.API
{
    public class CreateBusinessRequestDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public BusinessServiceProperty BusinessServiceProperty { get; set; } = new BusinessServiceProperty();
        public bool IsNew { get; set; }
        public BusinessContactProperty BusinessContactPerson { get; set; } = new BusinessContactProperty();
        public string FileId { get; set; } = string.Empty;
    }
    
}