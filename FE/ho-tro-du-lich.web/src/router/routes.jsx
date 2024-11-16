import { Navigate } from "react-router-dom";
import Home from "../pages/HomePage/Home";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import NotificationSummary from "../pages/NotificationSummaryPage/NotificationSummary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ChatUI from "../common/components/Chat/ChatUI";
import AHomePage from "../pages/admin/AHomePage/AHomePage";

export const routes = [
  {
    path: "/",
    component: <Home />,
    checkAuth: false,
    roles: [],
    // errorElement: <Navigate to="/error" />,
    layout: <MainLayout />,
  },
  // {
  //   path: "/test",
  //   component: <Test />,
  //   checkAuth: false,
  //   roles: [],
  //   // errorElement: <Navigate to="/error" />,
  //   layout: <MainLayout />,
  // },
  {
    path: "/chat",
    component: <ChatUI />,
    checkAuth: false,
    roles: [],
    errorElement: <Navigate to="/error" />,
    // layout: <MainLayout />,
  },
  {
    path: "/dangnhap",
    component: <LoginPage />,
    checkAuth: false,
    roles: [],
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/dangky",
    component: <RegisterPage />,
    checkAuth: false,
    roles: [],
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/thongbao",
    component: <NotificationSummary />,
    checkAuth: false,
    roles: [],
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/error",
    component: <ErrorPage />,
    checkAuth: false,
    roles: [],
    errorElement: <div>Loi roi</div>,
  },
];
