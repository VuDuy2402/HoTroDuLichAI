import { toast } from "react-toastify";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";
import { publisherApi } from "../api/publisherApi";

export const publisherService = {
    requestBecomeToAPublisher: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(publisherApi.Publisher_RequestBeComeToAPublisher, data);
            if (response) {
                return response;
            }
            return null;
        }
        toast.error("Cannot connect to server.");
    },
    getMyDiscount: async (data) => {
        const token = localStorageService.getToken();
        if (token)
        {
            const response = await reqApi.post(publisherApi.Publisher_GetMyDiscount, data);
            if (response)
            {
                return response;
            }
            return null;
        }
        toast.error("Không thể kết nối đến Server.");
    },
    getMyCourseIntake: async (data) => {
        const token = localStorageService.getToken();
        if (token)
        {
            const response = await reqApi.post(publisherApi.Publisher_GetMyCourseIntake, data);
            if (response)
            {
                return response;
            }
            return null;
        }
        toast.error("Không thể kết nối đến Server.");
    }
}