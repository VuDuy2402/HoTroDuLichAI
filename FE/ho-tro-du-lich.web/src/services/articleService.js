import { articleApi } from "../api/articleApi";
import { reqApi } from "../axios/httpRequest";

export const articleService = {
  paging: async (data) => {
    const response = await reqApi.post(articleApi.Article_Paging, data);
    if (response) {
      return response;
    }
    return null;
  },
};
