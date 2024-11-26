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
    url: "/business/dashboard",
    icon: <IoStatsChartOutline color="red" />,
  },
  {
    label: "Địa điểm",
    url: "/business/place",
    icon: <IoLocationOutline />,
  },
  {
    label: "Tin tức",
    url: "/business/article",
    icon: <LuNewspaper />,
  },
];

export const routesBusiness = [
  {
    path: "/business",
    component: <BHomePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/business/dashboard",
    component: <BDashboardPage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/business/place",
    component: <BPlacePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/business/article",
    component: <BArticlePage />,
    checkAuth: true,
    roles: [Role.Business, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
];
