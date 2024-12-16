import { aiApi } from "../api/aiApi";
import { reqApi } from "../axios/httpRequest";

export const aiService = {
  getBusinessSuggestion: async (data) => {
    const response = await reqApi.post(aiApi.AI_Business_Suggestion, data);
    if (response) {
      return response;
    }
    return null;
  }
}