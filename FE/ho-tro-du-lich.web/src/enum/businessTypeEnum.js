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
