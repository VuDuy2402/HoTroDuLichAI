import { store } from "@/redux/index";
import { signalRAction } from "../redux/slices/signalRSlice";
export const signalRService = {
  commonSignalR: {
    "https://localhost:7001/notificationHub": {
      ReceiveNotification: async (response) => {
        store.dispatch(
          signalRAction.signalEvent({
            url: "https://localhost:7001/notificationHub",
            eventName: "ReceiveNotification",
            response: response,
          })
        );
      },
    },
  },
  bussinessSignalR: {},
  adminSignalR: {},
};
