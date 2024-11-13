using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public enum CNotificationType
    {
        [Description(description: "Không xác định")]
        None = 0,
        [Description(description: "Thông báo chung")]
        Normal = 1,
        [Description(description: "Gửi email")]
        Email = 2,
        [Description(description: "Đặt phòng / lập lịch chuyến đi")]
        Order = 3,
        [Description(description: "Đăng ký tài khoản")]
        Register = 4,
        [Description(description: "Địa điểm")]
        Place = 5
    }

    public enum CNotificationLevel
    {
        None = 0,
        [Description(description: "")]
        Info = 1,
        [Description(description: "")]
        Warning = 2,
        [Description(description: "Falied")]
        Error = 3,
        [Description(description: "Successfully")]
        Success = 4
    }
}