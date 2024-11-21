import { itineraryApi } from "../api/itinararyApi";
import { reqApi } from "../axios/httpRequest";

export const itineraryService = {
  getWithPaging: async (id, data) => {
    const response = await reqApi.post(
      itineraryApi.Itinerary_GetByPlaceId.replace(":placeId", id),
      data
    );
    if (response) {
      return response;
    }
    return null;
  },
  getDetail: async (id) => {
    const response = await reqApi.get(
      itineraryApi.Itinerary_Detail.replace(":itineraryId", id)
    );
    if (response) {
      return response;
    }
    return null;
  },
};
