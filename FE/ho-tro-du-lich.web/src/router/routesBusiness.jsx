import { Navigate } from "react-router-dom";
import { Role } from "../enum/permission";
import BHomePage from "../pages/business/BHomePage/BHomePage";
import MenuSideLayout from "../layouts/MenuSideLayout";
import BPlacePage from "../pages/business/BPlacePage/BPlacePage";
import BDashboardPage from "../pages/business/BDashboardPage/BDashboardPage";
import { IoLocationOutline, IoStatsChartOutline } from "react-icons/io5";
import { LuNewspaper } from "react-icons/lu";
import BArticlePage from "../pages/business/BArticlePage/BArticlePage";
const menusideItemBusiness = [
  {
    label: "Dashboard",
    url: "/doanhnghiep/dashboard",
    icon: <IoStatsChartOutline color="red" />,
  },
  {
    label: "Địa điểm",
    url: "/doanhnghiep/diadiem",
    icon: <IoLocationOutline color="" />,
  },
  {
    label: "Tin tức",
    url: "/doanhnghiep/tintuc",
    icon: <LuNewspaper color="" />,
  },
];

export const routesBusiness = [
  {
    path: "/doanhnghiep",
    component: <BHomePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/doanhnghiep/dashboard",
    component: <BDashboardPage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/doanhnghiep/diadiem",
    component: <BPlacePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/doanhnghiep/tintuc",
    component: <BArticlePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
];
