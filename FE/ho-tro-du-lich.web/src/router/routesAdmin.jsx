import { Role } from "@/enum/permission";
import { Navigate } from "react-router-dom";
import MenuSideLayout from "../layouts/MenuSideLayout";
import AHomePage from "../pages/admin/AHomePage/AHomePage";
import AUserIndex from "../pages/admin/AUserManagePage/AUserIndex";
import APlaceIndexPlace from "../pages/admin/APlaceManage/APlaceIndexPage";
import ARequestNewPlacePage from "../pages/admin/ARequestNewPlacePage/ARequestNewPlacePage";
import ARequestNewPlaceDetailPage from "../pages/admin/ARequestNewPlaceDetailPage/ARequestNewPlaceDetailPage";
import AArticlePage from "../pages/admin/AArticlePage/AArticlePage";

const menuSideItemAdmin = [
  { label: "Đơn yêu cầu", url: "/admin/requestnewplace" },
  { label: "Người dùng", url: "/admin/manageuser" },
  { label: "Địa điểm", url: "/admin/manageplace" },
  { label: "Tin tức", url: "/admin/article" },
  { label: "Thống kê", url: "/admin/dashboard" },
];

export const routersAdmin = [
  {
    path: "/admin",
    component: <AHomePage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/admin/manageuser",
    component: <AUserIndex />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/admin/manageplace",
    component: <APlaceIndexPlace />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/admin/requestnewplace",
    component: <ARequestNewPlacePage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/admin/requestnewplace/detail/:placeId",
    component: <ARequestNewPlaceDetailPage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
  {
    path: "/admin/article",
    component: <AArticlePage />,
    checkAuth: true,
    roles: [Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menuSideItemAdmin} />,
  },
];
