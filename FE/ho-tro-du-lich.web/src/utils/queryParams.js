// src/utils/queryParams.js
export const getQueryParameters = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (let [key, value] of params.entries()) {
    result[key.toLowerCase()] = value;
  }

  return result;
};

export const toQueryString = (obj) => {
  if (!obj) {
    throw new Error("Đối tượng không được phép là null hoặc undefined.");
  }

  const queryString = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key].toString())}`
    )
    .join("&");

  return queryString;
};