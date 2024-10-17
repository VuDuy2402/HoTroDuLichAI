import { courseCategoryApi } from "../api/courseCategoryApi";
import { reqApi } from "../axios/httpRequest";

export const courseCategoryService = {
  getAll: async () => {
    const data = { pageNumber: 0, pageSize: 0, searchQuery: "", isAll: true };
    const response = await reqApi.post(
      courseCategoryApi.CourseCategory_Paging,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },
};
