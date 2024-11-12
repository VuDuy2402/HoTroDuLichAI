// src/utils/enums.js

// Enums for Place Type
export const CApprovalType = {
    None: 0,
    Accepted: 1,
    Rejected: 2,
    PendingAprroval: 3,
};

// Descriptions for Place Type
export const ApprovalTypeDescriptions = {
    [CApprovalType.None]: "Không xác định",
    [CApprovalType.Accepted]: "Đã chấp nhận",
    [CApprovalType.Rejected]: "Đã bị từ chối",
    [CApprovalType.PendingAprroval]: "Chờ xác nhận",
};
