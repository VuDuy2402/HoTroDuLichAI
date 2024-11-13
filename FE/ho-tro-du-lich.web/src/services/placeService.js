import { placeApi } from "../api/placeApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";


export const placeService = {
    getWithPaging: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(placeApi.Place_GetWithPaging, data);
            if (response) {
                return response;
            }
            return null;
        }
    },

    getWithPagingAdmin: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(placeApi.Place_Admin_GetWithPaging, data);
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
            const response = await reqApi.get(`${placeApi.Place_Admin_GetPlaceById}/${placeId}`);
            if (response) {
                return response;
            }
            return null;
        }
    },

    createPlaceAdmin: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(placeApi.Place_Admin_CreatePlace, data);
            if (response) {
                return response;
            }
            return null;
        }
    }
}