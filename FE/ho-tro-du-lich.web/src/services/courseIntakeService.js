import { courseIntakeApi } from "../api/courseIntakeApi";
import { reqApi } from "../axios/httpRequest";
import { store } from "../redux";
import { containerCacheAction } from "../redux/slices/containerCache";

export const courseIntakeService = {
  paging: async (data) => {
    const response = await reqApi.post(
      courseIntakeApi.CourseIntake_Paging,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },
  intakeDetail: async (data) => {
    const response = await reqApi.get(
      courseIntakeApi.CourseIntake_Detail + "/" + data
    );
    if (response) {
      return response;
    }
    return null;
  },
};
