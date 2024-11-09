import { toast } from "react-toastify";
import { chatApi } from "../api/chatApi";
import { reqApi } from "../axios/httpRequest";
import { localStorageService } from "./localstorageService";

export const chatService =
{
    getMyConversations: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(chatApi.Chat_GetMyConversations, data);
            if (response) {
                return response;
            }
            toast.error("Không thể kết nối đến Server.");
            return null;
        }
    },

    sendMessage: async (data) => {
        const token = localStorageService.getToken();
        if (token) {
            const response = await reqApi.post(chatApi.Chat_SendMessage, data);
            if (response) {
                return response;
            }
            toast.error("Không thể kết nối đến Server.");
            return null;
        }
    },
}