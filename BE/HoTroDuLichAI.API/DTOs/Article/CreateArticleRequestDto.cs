using System.ComponentModel.DataAnnotations;

namespace HoTroDuLichAI.API
{
    public class CreateArticleRequestDto
    {
        [Required(ErrorMessage = "Tiêu đề bài viết là bắt buộc.")]
        [StringLength(200, ErrorMessage = "Tiêu đề bài viết không được vượt quá 200 ký tự.")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nội dung bài viết là bắt buộc.")]
        [StringLength(5000, ErrorMessage = "Nội dung bài viết không được vượt quá 5000 ký tự.")]
        public string Content { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên tác giả là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên tác giả không được vượt quá 100 ký tự.")]
        public string Author { get; set; } = string.Empty;

        [Required(ErrorMessage = "Loại bài viết là bắt buộc.")]
        public CArticleType Type { get; set; }

        [Required(ErrorMessage = "Trạng thái phê duyệt là bắt buộc.")]
        public CApprovalType Approved { get; set; }

        // [MinLength(1, ErrorMessage = "Ít nhất phải có một hình ảnh cho bài viết.")]
        // public List<ArticleImageDto> ImageDtos { get; set; } = new();
        [Required(ErrorMessage = "Ảnh bìa không được để trống.")]
        public string ThumbnailFileId { get; set; } = string.Empty;
    }

    public class ArticleImageDto
    {
        [Required(ErrorMessage = "ID tệp hình ảnh là bắt buộc.")]
        [StringLength(50, ErrorMessage = "ID tệp hình ảnh không được vượt quá 50 ký tự.")]
        public string FileId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Trường 'IsDefault' là bắt buộc.")]
        public bool IsDefault { get; set; }

        [Required(ErrorMessage = "Loại hình ảnh là bắt buộc.")]
        public CImageType ImageType { get; set; }
    }
}
