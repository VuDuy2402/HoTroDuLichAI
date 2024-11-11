using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public enum CApprovalType
    {
        [Description(description: "Không xác định")]
        None = 0,
        [Description(description: "Đã chấp nhận")]
        Accepted = 1,
        [Description(description: "Đã bị từ chối")]
        Rejected = 2,
        [Description(description: "Chờ xác nhận")]
        PendingAprroval = 3
    }
}