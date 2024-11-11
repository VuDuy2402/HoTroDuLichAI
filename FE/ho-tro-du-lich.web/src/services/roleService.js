import { roleApi } from "../api/roleApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";


export const roleService = {
  getWithPaging: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(roleApi.Role_GetWithPaging, data);
      if (response) {
        return response;
      }
      return null;
    }
  },
}