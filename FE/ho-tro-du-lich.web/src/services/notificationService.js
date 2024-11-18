import { toast } from "react-toastify";
import { notificationApi } from "../api/notificationApi";
import { reqApi } from "../axios/httpRequest";

export const notificationService = {
  getWithPaging: async (data) => {
    const response = await reqApi.post(
      notificationApi.Notification_GetWithPaging,
      data
    );
    if (response) {
      return response;
    }
    return null;
  },

  countUnRead: async () => {
    const response = await reqApi.get(notificationApi.Notification_CountUnRead);
    if (response) {
      return response;
    }
    return null;
  },
  resetUnRead: async () => {
    const response = await reqApi.post(
      notificationApi.Notification_ResetUnRead
    );
    if (response) {
      return response;
    }
    return null;
  },
};
