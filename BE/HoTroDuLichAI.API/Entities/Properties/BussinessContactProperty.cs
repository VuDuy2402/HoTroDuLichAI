namespace HoTroDuLichAI.API
{
    public class BusinessContactProperty
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public ImageProperty ImageProperty { get; set; } = null!;
    }

    public class BusinessContactPersonInfoResponseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string FileId { get; set; } = string.Empty;
    }
}