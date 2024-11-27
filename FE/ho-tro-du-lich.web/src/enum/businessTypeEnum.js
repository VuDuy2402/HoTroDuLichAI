// src/utils/enums.js

// Enums for Business Type
export const CBusinessType = {
  None: 0,
  Hotel: 1,
  Restaurant: 2,
};

// Descriptions for Business Type
export const PlaceTypeDescriptions = {
  [CBusinessType.None]: "Không xác định",
  [CBusinessType.Hotel]: "Khách sạn",
  [CBusinessType.Restaurant]: "Nhà hàng",
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

export const CBusinessServiceType = {
  None: 0,
  Room: 1,
  Food: 2,
  Drink: 3,
};

export const BusinessServiceTypeDescriptions = {
  [CBusinessServiceType.None]: "",
  [CBusinessServiceType.Room]: "Phòng",
  [CBusinessServiceType.Food]: "Bàn",
  [CBusinessServiceType.Drink]: "Người",
};
