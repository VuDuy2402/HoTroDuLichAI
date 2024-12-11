import { articleApi } from "../api/articleApi";
import { reqApi } from "../axios/httpRequest";

export const articleService = {
  getWithPagingAdmin: async (data) => {
    const response = await reqApi.post(articleApi.Article_Manage_Paging, data);
    if (response) {
      return response;
    }
    return null;
  },

  registerNewArticle: async (data) => {
    const response = await reqApi.post(articleApi.Article_Admin_SendRequest, data);
    if (response) {
      return response;
    }
    return null;
  }
};