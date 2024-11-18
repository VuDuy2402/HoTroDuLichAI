import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { renderRouter } from "./router";
import { useEffect } from "react";
import { initConnection } from "./utils/signalRUtil";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoleSelector } from "./redux/selectors/authSelector";
import { localStorageService } from "./services/localstorageService";
import { signalRAction } from "./redux/slices/signalRSlice";
const router = createBrowserRouter(renderRouter());
const SignalR = () => {
  const dispatch = useDispatch();
  const roleUser = useSelector(getUserRoleSelector);
  useEffect(() => {
    const initSignalR = async () => {
      const token = localStorageService.getAccessToken();
      const eventNotifications = await initConnection(
        "https://localhost:7001/notificationHub",
        token
      );
      dispatch(
        signalRAction.initEvent({
          url: "https://localhost:7001/notificationHub",
          listEventName: eventNotifications,
        })
      );
    };
    if (roleUser && roleUser.length > 0) {
      initSignalR();
    }
  }, [roleUser]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default SignalR;
