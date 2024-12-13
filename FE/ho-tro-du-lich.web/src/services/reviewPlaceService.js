import { reqApi } from "../axios/httpRequest";
import { reviewPlaceApi } from "../api/reviewPlaceApi";

export const reviewPlaceService = {
    getReviewOfPlaceWithPaging: async (placeId, params) => {
        const response = await reqApi.post(
            `${reviewPlaceApi.ReviewPlace_Place_Paging}/${placeId}/paging`,
            params
        );
        if (response) {
            return response;
        }
        return null;
    },
    createReviewOfPlace: async (data) => {
        const response = await reqApi.post(reviewPlaceApi.ReviewPlace_Manage_Create, data);
        if (response) {
            return response;
        }
        return null;
    },
    updateReviewOfPlace: async (data) => {
        const response = await reqApi.put(reviewPlaceApi.ReviewPlace_Manage_Create, data);
        if (response) {
            return response;
        }
        return null;
    },
    deleteReviewOfPlace: async (data) => {
        const response = await reqApi.delete(`${reviewPlaceApi.ReviewPlace_Manage_Create}/${data}`);
        if (response) {
            return response;
        }
        return null;
    }
}