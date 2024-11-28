// src/utils/queryParams.js

export const getQueryParameters = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (let [key, value] of params.entries()) {
    result[key.toLowerCase()] = value !== null && value !== undefined ? value : '';
  }

  return result;
};

export const getEnumValue = (enumObj, value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isNaN(parseInt(value))) {
    return parseInt(value);
  }

  const enumKey = Object.keys(enumObj).find(
    (key) => key.toLowerCase() === value.toLowerCase()
  );

  return enumKey ? enumObj[enumKey] : null;
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