namespace HoTroDuLichAI.API
{
    #region image info
    public class ImageProperty
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string BlobId { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string FolderName { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int Width { get; set; } = 0;
        public int Height { get; set; } = 0;
        public bool IsDefault { get; set; } = false;
        public CBlobType BlobType { get; set; }
        public CImageType ImageType { get; set; }
        public CFileExtensionType FileExtensionType { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
    }
    #endregion image info
}