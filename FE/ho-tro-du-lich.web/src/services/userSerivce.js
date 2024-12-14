import { toast } from "react-toastify";
import { userApi } from "../api/userApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const userService = {
  getBaseProfile: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_Profile);
      if (response) {
        return response;
      }
      return null;
    }
  },
  updateAvatar: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.put(userApi.User_UpdateAvatar, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
  getMyBusiness: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_MyBusiness);
      if (response) {
        return response;
      }
      return null;
    }
  },
  getMyProfile: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_MyProfile);
      if (response) {
        return response;
      }
      return null;
    }
  },
  updateMyProfile: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.put(userApi.User_UpdateMyProfile, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
  getAdminUser: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_GetAdminUsers);
      if (response) {
        return response;
      }
      toast.error("Không thể kết nối đến server.");
    }
  },
  getNormalUser: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_GetAdminUsers);
      if (response) {
        return response;
      }
      toast.error("Không thể kết nối đến server.");
    }
  },



  // admin
  getWithPaging: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(userApi.User_GetWithPaging, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
  deleteUser: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.delete(userApi.User_Delete + "/" + data);
      if (response) {
        return response;
      }
      return null;
    }
  },

  getById: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_GetById + "/" + data);
      if (response) {
        return response;
      }
      return null;
    }
  },

  createUser: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(userApi.User_Create, data);
      if (response) {
        return response;
      }
      return null;
    }
  },

  updateUser: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.put(userApi.User_Delete, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
};
