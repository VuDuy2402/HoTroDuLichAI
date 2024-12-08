// src/utils/enums.js

// Enums for Business Type
export const CBusinessServiceType = {
  None: 0,
  Hotel: 1,
  Villa: 2,
  Restaurant: 3,
};

// Descriptions for Business Type
export const CBusinessServiceTypeDescriptions = {
  [CBusinessServiceType.None]: "Không xác định",
  [CBusinessServiceType.Hotel]: "Khách sạn",
  [CBusinessServiceType.Villa]: "Khu nghỉ dưỡng",
  [CBusinessServiceType.Restaurant]: "Nhà hàng",
};

export const CBusinessServiceStatus = {
  None: 0,
  Available: 1,
  NotAvailable: 2,
};

export const CBusinessServiceStatusDescription = {
  [CBusinessServiceStatus.None]: "Không xác đinh",
  [CBusinessServiceStatus.Available]: "Đang hoạt động",
  [CBusinessServiceStatus.NotAvailable]: "Ngưng hoạt động",
};

export const CApprovalType = {
  None : 0,
  Accepted : 1,
  Rejected : 2,
  PendingAprroval : 3
};

export const CApprovalTypeDescription = {
  [CApprovalType.None]: "Không xác định",
  [CApprovalType.Accepted]: "Đã chấp nhận",
  [CApprovalType.Rejected]: "Đã bị từ chối",
  [CApprovalType.PendingAprroval]: "Chờ xác nhận"
};
