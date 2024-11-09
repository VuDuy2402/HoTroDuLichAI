namespace HoTroDuLichAI.API
{
    public class ImageKitUploadResponseDto
    {
        public List<ImageUploadInfo> ImageInfos { get; set; } = new();
    }

    public class ImageKitUploadRequestDto
    {
        public List<IFormFile> Files { get; set; } = new();
    }

    public class ImageKitDeleteRequestDto
    {
        public List<string> FileIds { get; set; } = new();
    }

    public class ErrorGetImageDetailDto
    {
        public string Message { get; set; } = string.Empty;
        public string Help { get; set; } = string.Empty;
    }

    public class ImageUploadInfo
    {
        public string FileId { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string FileSize { get; set; } = string.Empty;
    }



    public abstract class FileInfoBase
    {
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string FileId { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public List<string> AITags { get; set; } = new();
        public VersionInfo VersionInfo { get; set; } = null!;
        public bool IsPublished { get; set; }
        public object CustomCoordinates { get; set; } = null!;
        public Dictionary<string, string> CustomMetadata { get; set; } = new();
        public bool IsPrivateFile { get; set; }
        public string Url { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public long Size { get; set; }
    }

    public class VideoFileInfo : FileInfoBase
    {
        public int Height { get; set; }
        public int Width { get; set; }
        public int BitRate { get; set; }
        public int Duration { get; set; }
        public string AudioCodec { get; set; } = string.Empty;
        public string VideoCodec { get; set; } = string.Empty;
    }

    public class ImageFileInfo : FileInfoBase
    {
        public int Height { get; set; }
        public int Width { get; set; }
        public bool HasAlpha { get; set; }
        public string Mime { get; set; } = string.Empty;
        public string Thumbnail { get; set; } = string.Empty;
    }
    public class VersionInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class EmbeddedMetadata
    {
        public DateTime DateCreated { get; set; }
        public DateTime DateTimeCreated { get; set; }
    }
}