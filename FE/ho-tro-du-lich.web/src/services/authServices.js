import { authApi } from "../api/authApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const authService = {
  isAuthenticated: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(authApi.CET_Auth_Authentication);
      if (response) {
        return response.data;
      }
    }
    return null;
  },
  refreshToken: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const userSession = JSON.parse(token);
      const response = await reqApi.post(authApi.CET_Auth_RefreshToken, {
        refreshToken: userSession.refreshToken,
      });
      if (response && response.success) {
        localStorageService.setToken(JSON.stringify(response.data));
        return true;
      }
      localStorageService.removeToken();
    }
    return false;
  },
  getUserRoles: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(authApi.CET_User_Roles);
      if (response && response.success) {
        return response.data;
      }
    }
    return null;
  },
  login: async (data) => {
    const token = localStorageService.getToken();
    if (!token && token !== "undefined") {
      const response = await reqApi.post(authApi.CET_Auth_System_Login, data);
      if (response) {
        return response;
      }
    }
    return true;
  },
  googlelogin: async (data) => {
    const token = localStorageService.getToken();
    if (!token && token !== "undefined") {
      const response = await reqApi.post(authApi.CET_Auth_Google_Login, data);
      if (response) {
        return response;
      }
    }
    return true;
  },
  logout: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(authApi.CET_Auth_LogOut);
      if (response) {
        return response;
      }
      return null;
    }
  },
  signup: async (data) => {
    const response = await reqApi.post(authApi.CET_Auth_Register, data);
    if (response) {
      return response;
    }
    return null;
  },
  getAuthAndRole: async () => {
    let isAuthenticated = false;
    let listRoles = [];
    const isAuth = await authService.isAuthenticated();

    if (isAuth) {
      isAuthenticated = true;
    } else {
      const isRefresh = await authService.refreshToken();
      if (isRefresh) {
        isAuthenticated = isRefresh;
      }
    }
    const role = await authService.getUserRoles();

    if (role && role.length > 0) {
      listRoles = role;
    }
    return { isAuthenticated, listRoles };
  },
};
