import { Navigate } from "react-router-dom";
import Home from "../pages/user/HomePage/Home";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/user/LoginPage/index";
import RegisterPage from "../pages/user/RegisterPage/index";

import NotificationSummary from "../pages/NotificationSummaryPage/NotificationSummary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ChatUI from "../common/components/Chat/ChatUI";
import PlacePage from "../pages/user/PlacePage/PlacePage";
import PlaceDetailPage from "../pages/user/PlaceDetailPage/PlaceDetailPage";
import NavbarLayout from "../layouts/NavbarLayout";
import ItineraryDetailPage from "../pages/user/ItineraryDetailPage/ItineraryDetailPage";

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
    path: "/diadiem",
    component: <PlacePage />,
    checkAuth: false,
    roles: [],
    layout: <MainLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/diadiem/:placeId",
    component: <PlaceDetailPage />,
    checkAuth: false,
    roles: [],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/hanhtrinh/:itineraryId",
    component: <ItineraryDetailPage />,
    checkAuth: false,
    roles: [],
    layout: <NavbarLayout />,
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
