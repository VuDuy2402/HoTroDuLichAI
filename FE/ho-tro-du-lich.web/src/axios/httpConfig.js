import axios from "axios";
import { toast } from "react-toastify";

const axiosRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
});

axiosRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authentication-GOC-App-Token");
    if (token) {
      const userSession = JSON.parse(token);
      config.headers["Authorization"] = `Bearer ${userSession.accessToken}`;
    }

    // Nếu gửi FormData, xóa Content-Type để axios tự động thêm 'multipart/form-data'
    if (config.data instanceof FormData) {
      toast.warn("Đang gửi FormData");  // Kiểm tra nếu đang gửi FormData
      // Không cần phải xóa content-type, để axios tự động xử lý
    } else {
      config.headers["Content-Type"] = "application/json"; // Nếu là JSON, set lại content-type
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosRequest;
