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
  getIntakeFavorite: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(userApi.User_MyIntakeFavorite);
      if (response) {
        return response;
      }
      return null;
    }
  },
  postIntakeFavorite: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(userApi.User_AddIntakeFavorite, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
  cancelIntakeFavorite: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.delete(
        userApi.User_CancelIntakeFavorite + "/" + data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },
};
