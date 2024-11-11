import { Role } from "@/enum/permission";
import { Navigate } from "react-router-dom";
import MenuSideLayout from "../layouts/MenuSideLayout";
import AHomePage from "../pages/admin/AHomePage/AHomePage";
import AUserIndex from "../pages/admin/AUserManagePage/AUserIndex";
import APlaceIndexPlace from "../pages/admin/APlaceManage/APlaceIndexPage";

const menuSideItemAdmin = [
  { label: "Người dùng", url: "/admin/manageuser" },
  { label: "Địa điểm", url: "/admin/manageplace" },
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
];
