// src/utils/enums.js
export const CNotificationType = {
    None: 0,
    Normal: 1,
    Email: 2,
    Order: 3,
    Register: 4,
    Place: 5,
    Business: 6,
};

export const CNotificationLevel = {
    None: 0,
    Info: 1,
    Warning: 2,
    Error: 3,
    Success: 4,
};

// Description mappings
export const NotificationTypeDescriptions = {
    [CNotificationType.None]: 'Chưa xác định',
    [CNotificationType.Normal]: 'Thông báo',
    [CNotificationType.Email]: 'Gửi email',
    [CNotificationType.Order]: 'Order',
    [CNotificationType.Register]: 'Đăng ký',
    [CNotificationType.Place]: 'Địa điểm',
    [CNotificationType.Business]: 'Doanh nghiệp',
};

export const NotificationLevelDescriptions = {
    [CNotificationLevel.None]: 'Chưa xác định',
    [CNotificationLevel.Info]: 'Thông tin',
    [CNotificationLevel.Warning]: 'Cảnh báo',
    [CNotificationLevel.Error]: 'Lỗi',
    [CNotificationLevel.Success]: 'Thành công',
};
