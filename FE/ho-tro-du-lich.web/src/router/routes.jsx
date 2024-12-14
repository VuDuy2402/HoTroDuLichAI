import { Navigate } from "react-router-dom";
import Home from "../pages/user/HomePage/Home";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/user/LoginPage/index";
import RegisterPage from "../pages/user/RegisterPage/index";
import NotificationSummary from "../pages/commonpage/NotificationSummaryPage/NotificationSummary";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import ChatUI from "../common/components/Chat/ChatUI";
import PlacePage from "../pages/user/PlacePage/PlacePage";
import PlaceDetailPage from "../pages/user/PlaceDetailPage/PlaceDetailPage";
import NavbarLayout from "../layouts/NavbarLayout";
import ItineraryDetailPage from "../pages/user/ItineraryDetailPage/ItineraryDetailPage";
import { Role } from "../enum/permission";
import AuthLayout from "../layouts/AuthLayout";
import RegisterNewPlacePage from "../pages/user/RequestPage/RegisterNewPlacePage";
import RegisterNewBusinessPage from "../pages/user/RequestPage/RegisterNewBusinessPage";
import RegisterNewArticlePage from "../pages/user/RequestPage/RegisterNewArticlePage";
import MyEditor from "../pages/user/RequestPage/MyEditor";
import ArticleDetailPage from "../pages/user/ArticleDetailPage/ArticleDetailPage";
import AUpdateArticlePage from "../pages/admin/AArticlePage/AUpdateArticlePage";
import ProfilePage from "../pages/user/ProfilePage/ProfilePage";
import MenuSideLayout from "../layouts/MenuSideLayout";
import { IoInformationCircleOutline, IoLocateOutline, IoNotificationsOffCircleOutline } from "react-icons/io5";
import UArticleIndexPage from "../pages/user/ArticleDetailPage/UArticleIndexPage";
import UPlaceIndexPlace from "../pages/user/PlaceDetailPage/UPlaceIndexPage";
import ArticlePage from "../pages/user/ArticleDetailPage/ArticlePage";

export const routes = [
  {
    path: "/",
    component: <Home />,
    checkAuth: false,
    roles: [],
    layout: <MainLayout />,
  },
  {
    path: "/editor",
    component: <MyEditor />,
    checkAuth: false,
    roles: [],
    layout: <MainLayout />,
  },
  {
    path: "/chat",
    component: <ChatUI />,
    checkAuth: false,
    roles: [],
    errorElement: <Navigate to="/error" />,
    layout: <MainLayout />,
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
    layout: <AuthLayout />
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
    path: "/diadiem/dangky",
    component: <RegisterNewPlacePage />,
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
    path: "/doanhnghiep/dangky",
    component: <RegisterNewBusinessPage />,
    checkAuth: true,
    roles: [Role.NormalUser],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/tintuc",
    component: <ArticlePage />,
    checkAuth: true,
    roles: [Role.NormalUser],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/baiviet/chitiet/:articleId",
    component: <ArticleDetailPage />,
    checkAuth: true,
    roles: [],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/baiviet/capnhat/:articleId",
    component: <AUpdateArticlePage />,
    checkAuth: true,
    roles: [Role.NormalUser, Role.Business, Role.Admin],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },
  {
    path: "/baiviet/dangky",
    component: <RegisterNewArticlePage />,
    checkAuth: true,
    roles: [Role.NormalUser, Role.Business],
    layout: <NavbarLayout />,
    errorElement: <Navigate to="/error" />,
  },

  {
    path: "/canhan/thongtin",
    component: <ProfilePage />,
    checkAuth: true,
    roles: [Role.NormalUser],
    errorElement: <Navigate to="/error" />,
    layout: (
      <MenuSideLayout
        items={[
          { 
            label: "Thông tin cá nhân",
            icon: <IoInformationCircleOutline />,
            url: "/canhan/thongtin" },
          {
            label: "Bài viết của tôi",
            icon: <IoNotificationsOffCircleOutline />,
            url: "/canhan/baiviet",
          },
          {
            label: "Địa điểm đã đăng",
            icon: <IoLocateOutline />,
            url: "/canhan/diadiem",
          },
        ]}
      />
    ),
  },

  {
    path: "/canhan/diadiem",
    component: <UPlaceIndexPlace />,
    checkAuth: true,
    roles: [Role.NormalUser],
    errorElement: <Navigate to="/error" />,
    layout: (
      <MenuSideLayout
        items={[
          { 
            label: "Thông tin cá nhân",
            icon: <IoInformationCircleOutline />,
            url: "/canhan/thongtin" },
          {
            label: "Bài viết của tôi",
            icon: <IoNotificationsOffCircleOutline />,
            url: "/canhan/baiviet",
          },
          {
            label: "Địa điểm đã đăng",
            icon: <IoLocateOutline />,
            url: "/canhan/diadiem",
          },
        ]}
      />
    ),
  },
  {
    path: "/canhan/baiviet",
    component: <UArticleIndexPage />,
    checkAuth: true,
    roles: [Role.NormalUser],
    errorElement: <Navigate to="/error" />,
    layout: (
      <MenuSideLayout
        items={[
          { 
            label: "Thông tin cá nhân",
            icon: <IoInformationCircleOutline />,
            url: "/canhan/thongtin" },
          {
            label: "Bài viết của tôi",
            icon: <IoNotificationsOffCircleOutline />,
            url: "/canhan/baiviet",
          },
          {
            label: "Địa điểm đã đăng",
            icon: <IoLocateOutline />,
            url: "/canhan/diadiem",
          },
        ]}
      />
    ),
  },
  {
    path: "/error",
    component: <ErrorPage />,
    checkAuth: false,
    roles: [],
    errorElement: <div>Loi roi</div>,
  },
];
