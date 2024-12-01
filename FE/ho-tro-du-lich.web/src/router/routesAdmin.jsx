import { Role } from "@/enum/permission";
import { Navigate } from "react-router-dom";
import MenuSideLayout from "../layouts/MenuSideLayout";
import AHomePage from "../pages/admin/AHomePage/AHomePage";
import AUserIndex from "../pages/admin/AUserManagePage/AUserIndex";
import APlaceIndexPlace from "../pages/admin/APlaceManage/APlaceIndexPage";
import AArticlePage from "../pages/admin/AArticlePage/AArticlePage";
import ADashboardPage from "../pages/admin/ADashboardPage/ADashboardPage";
import { IoLocationOutline, IoNotificationsOffCircleOutline, IoPeopleCircleOutline, IoPieChartOutline, IoTextOutline } from "react-icons/io5";
import AConfirmRegisterBusinessPage from "../pages/admin/ABusinessManage/AConfirmRegisterBusinessPage";
import AConfirmNewPlaceRequestPage from "../pages/admin/ARequestNewPlaceDetailPage/AConfirmNewPlaceRequestPage";
import AConfirmRegisterArticleRequestPage from "../pages/admin/AArticlePage/AConfirmRegisterArticleRequestPage";
import ANewPlaceRequestPagingPage from "../pages/admin/ARequestPage/ANewPlaceRequestPagingPage";
import ANewBusinessRequestPagingPage from "../pages/admin/ARequestPage/ANewBusinessRequestPagingPage";
import ANewArticleRequestPagingPage from "../pages/admin/ARequestPage/ANewArticleRequestPagingPage";

const menuSideItemAdmin = [
  {
    label: "Đơn yêu cầu",
    icon: <IoTextOutline />,
    children: [
      { label: "Địa điểm", url: "/quantri/yeucau/diadiem" },
      { label: "Doanh nghiệp", url: "/quantri/yeucau/doanhnghiep" },
      { label: "Bài viết", url: "/quantri/yeucau/baiviet" },
    ],
  },
  { label: "Người dùng", url: "/quantri/nguoidung", icon: <IoPeopleCircleOutline /> },
  { label: "Địa điểm", url: "/quantri/diadiem", icon: <IoLocationOutline />, },
  { label: "Tin tức", url: "/quantri/baiviet", icon: <IoNotificationsOffCircleOutline /> },
  { label: "Thống kê", url: "/quantri/dashboard", icon: <IoPieChartOutline /> },
];

export const routersAdmin = [
  {
    path: "/quantri",
    component: <AHomePage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/nguoidung",
    component: <AUserIndex />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/dashboard",
    component: <ADashboardPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/diadiem",
    component: <APlaceIndexPlace />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/baiviet",
    component: <AArticlePage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },

  // #region Yeu Cau
  {
    path: "/quantri/yeucau/diadiem",
    component: <ANewPlaceRequestPagingPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/yeucau/doanhnghiep",
    component: <ANewBusinessRequestPagingPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/yeucau/baiviet",
    component: <ANewArticleRequestPagingPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  // #endregion Yeu Cau


  //#region Dia Diem
  {
    path: "/quantri/xacnhan/diadiem/:placeId",
    component: <AConfirmNewPlaceRequestPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/xacnhan/doanhnghiep:businessId",
    component: <AConfirmRegisterBusinessPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/quantri/xacnhan/baiviet:articleId",
    component: <AConfirmRegisterArticleRequestPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  //#endregion Dia Diem
];
