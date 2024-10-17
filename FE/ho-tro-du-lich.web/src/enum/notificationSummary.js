// src/utils/enums.js
export const CNotificationType = {
    None: 0,
    Normal: 1,
    Email: 2,
    Order: 3,
    Register: 4,
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
    [CNotificationType.None]: '',
    [CNotificationType.Normal]: 'Normal',
    [CNotificationType.Email]: 'Send email',
    [CNotificationType.Order]: 'Order',
    [CNotificationType.Register]: 'Registration account',
};

export const NotificationLevelDescriptions = {
    [CNotificationLevel.None]: '',
    [CNotificationLevel.Info]: '',
    [CNotificationLevel.Warning]: '',
    [CNotificationLevel.Error]: 'Failed',
    [CNotificationLevel.Success]: 'Successfully',
};
