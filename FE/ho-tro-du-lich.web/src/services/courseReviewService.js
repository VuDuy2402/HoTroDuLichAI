import { courseReviewApi } from "../api/courseReviewApi";
import { reqApi } from "../axios/httpRequest";

export const courseReviewService = {
  paging: async (data) => {
    const response = await reqApi.post(
      courseReviewApi.CourseReview_Paging,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },
};
