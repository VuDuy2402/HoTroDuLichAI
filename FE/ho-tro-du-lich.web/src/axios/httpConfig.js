import axios from "axios";
const axiosRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authentication-GOC-App-Token");
    if (token) {
      const userSession = JSON.parse(token);
      config.headers["Authorization"] = `Bearer ${userSession.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosRequest;
