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
        toast.error("Không thể kết nối đến server.");
        return null;
    },

    countUnRead: async () => {
        const response = await reqApi.get(
            notificationApi.Notification_CountUnRead);
        if (response) {
            return response;
        }
        toast.error("Không thể kết nối đến server.");
        return null;
    },
};
