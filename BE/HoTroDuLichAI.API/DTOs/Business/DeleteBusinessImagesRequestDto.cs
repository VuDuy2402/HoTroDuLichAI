namespace HoTroDuLichAI.API
{
    public class DeleteBusinessImagesRequestDto
    {
        public Guid BusinessId { get; set; }
        public string FileId { get; set; } = string.Empty;
    }
}