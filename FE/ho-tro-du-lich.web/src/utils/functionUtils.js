export const convertSecondToHourMinSecond = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours > 0 ? hours + " giờ " : ""}${
    minutes > 0 ? minutes + " phút " : ""
  }${remainingSeconds} giây`;
};
