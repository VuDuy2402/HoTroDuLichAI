namespace HoTroDuLichAI.API
{
    public class VideoProperty
    {
        public string Name { get; set; } = string.Empty;
        public string UploadedBy { get; set; } = string.Empty;
        public long Size { get; set; }
        public long Duration { get; set; }
        public int TotalView { get; set; } = 0;
        public List<string> Tags { get; set; } = new List<string>();
    }
}
