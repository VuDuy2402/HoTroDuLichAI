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

  getWithPagingAdmin: async (data) => {
    const response = await reqApi.post(articleApi.Article_Manage_Paging, data);
    if (response) {
      return response;
    }
    return null;
  },

  getArticleDetailById: async (data) => {
    const response = await reqApi.get(`${articleApi.Article_GetById}/${data}`);
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