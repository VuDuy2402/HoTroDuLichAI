using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public enum CArticleType
    {
        [Description(description: "Không xác định")]
        None = 0,
        [Description(description: "Người dùng thường")]
        Individual = 1,
        [Description(description: "Doanh nghiệp")]
        Business = 2
    }
}