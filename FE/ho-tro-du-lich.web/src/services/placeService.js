import { placeApi } from "../api/placeApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const placeService = {
  getWithPaging: async (data) => {
    const response = await reqApi.post(placeApi.Place_GetWithPaging, data);
    if (response) {
      return response;
    }
    return null;
  },

  getMyPlacePaging: async (data) => {
    const response = await reqApi.post(placeApi.Place_GetMyPlace, data);
    if (response) {
      return response;
    }
    return null;
  },

  getNewPlacePaging: async (data) => {
    const response = await reqApi.post(placeApi.Place_GetNewPlace, data);
    if (response) {
      return response;
    }
    return null;
  },

  getWithPagingAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_GetWithPaging,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  getWithPagingRequestNewPlaceAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_GetRequestNewPlaceWithPaging,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  getWithPagingMy: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(placeApi.Place_My_GetWithPaging, data);
      if (response) {
        return response;
      }
      return null;
    }
  },

  getPlaceById: async (placeId) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.get(
        `${placeApi.Place_Admin_GetPlaceById}/${placeId}`
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  createPlaceAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_CreatePlace,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  updatePlaceAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.put(placeApi.Place_Admin_UpdatePlace, data);
      if (response) {
        return response;
      }
      return null;
    }
  },

  deletePlaceById: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.delete(`${placeApi.Place_Admin_DeletePlace}/${data}`);
      if (response) {
        return response;
      }
      return null;
    }
  },

  deletePlaceImagesAdmin: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_DeletePlaceImages,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  requestNewPlacePaging: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_RequestNewPlace_Page,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },
  approveNewPlace: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_Admin_ApproveNewPlace_Page,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  // normal user
  requestCreatePlace: async (data) => {
    const token = localStorageService.getToken();
    if (token) {
      const response = await reqApi.post(
        placeApi.Place_User_RequestCreatePlace,
        data
      );
      if (response) {
        return response;
      }
      return null;
    }
  },

  // normal user
};
