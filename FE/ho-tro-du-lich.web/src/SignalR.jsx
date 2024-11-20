import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { renderRouter } from "./router";
import { useEffect } from "react";
import { initConnection } from "./utils/signalRUtil";
import { useDispatch, useSelector } from "react-redux";
import { getUserRoleSelector } from "./redux/selectors/authSelector";
import { localStorageService } from "./services/localstorageService";
import { signalRAction } from "./redux/slices/signalRSlice";
const router = createBrowserRouter(renderRouter());

const objInitHub = [
  "https://localhost:7001/notificationHub",
  "https://localhost:7001/chathub",
];

const SignalR = () => {
  const dispatch = useDispatch();
  const roleUser = useSelector(getUserRoleSelector);
  useEffect(() => {
    const initSignalR = async () => {
      await initHub();
    };

    if (roleUser && roleUser.length > 0) {
      initSignalR();
    }
  }, [roleUser]);

  const initHub = async () => {
    const token = localStorageService.getAccessToken();
    for (const url of objInitHub) {
      const hub = await initConnection(url, token);
      dispatch(
        signalRAction.initEvent({
          url: url,
          listEventName: hub,
        })
      );
    }
  };
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default SignalR;
