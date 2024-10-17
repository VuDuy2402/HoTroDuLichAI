import { imageKitApi } from "../api/imageKitApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const imageKitService = {
  getAuth: async () => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(imageKitApi.Image_Auth);
      if (response.success) {
        return response.data;
      } else {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }
    }
  },
};
