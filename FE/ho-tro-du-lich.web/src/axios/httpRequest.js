import { toQueryString } from "../utils/queryParams";
import axiosRequest from "./httpConfig";
import { toast } from "react-toastify";

export const reqApi = {
  post: async (url, data) => {
    try {
      const res = await axiosRequest.post(url, data);
      return res.data;
    } catch (error) {
      toast.error(error);
      if (error && error.response && error.response.data) {
        return error.response.data;
      }
    }
  },
  get: async (url) => {
    try {
      const res = await axiosRequest.get(url);
      return res.data;
    } catch (error) {
      toast.error(error);
      if (error && error.response && error.response.data) {
        return error.response.data;
      }
    }
  },
  put: async (url, data) => {
    try {
      const res = await axiosRequest.put(url, data);
      return res.data;
    } catch (error) {
      toast.error(error);
      if (error && error.response && error.response.data) {
        return error.response.data;
      }
    }
  },
  delete: async (url) => {
    try {
      const res = await axiosRequest.delete(url);
      return res.data;
    } catch (error) {
      toast.error(error);
      if (error && error.response && error.response.data) {
        return error.response.data;
      }
    }
  },
};
