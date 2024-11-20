namespace HoTroDuLichAI.API
{
    public class CreateBusinessRequestDto
    {
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public CBusinessServiceType businessServiceType { get; set; }
        public bool IsNew { get; set; }
        public string BusinessContactPerson { get; set; } = string.Empty;
        public string FileId { get; set; } = string.Empty;

    }

}