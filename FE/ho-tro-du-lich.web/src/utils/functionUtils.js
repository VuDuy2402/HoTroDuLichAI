export const convertSecondToHourMinSecond = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours > 0 ? hours + " giờ " : ""}${
    minutes > 0 ? minutes + " phút " : ""
  }${remainingSeconds} giây`;
};

/**
 *
 * @param {*} timeStr Nhận vào string thời gian có format HH:mm:ss
 */
export const convertFormatTimeToVN = (timeStr) => {
  const [hours, minutes] = timeStr.split(":"); // Tách chuỗi theo dấu ":"
  return `${hours} giờ ${minutes} phút`;
};
