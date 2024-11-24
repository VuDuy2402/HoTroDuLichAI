import { Navigate } from "react-router-dom";
import { Role } from "../enum/permission";
import BHomePage from "../pages/business/BHomePage.jsx/BHomePage";
import MenuSideLayout from "../layouts/MenuSideLayout";
import BPlacePage from "../pages/business/BPlacePage.jsx/BPlacePage";

const menusideItemBusiness = [{ label: "Địa điểm", url: "/business/place" }];

export const routesBusiness = [
  {
    path: "/business",
    component: <BHomePage />,
    checkAuth: true,
    roles: [Role.Publisher, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
  {
    path: "/business/place",
    component: <BPlacePage />,
    checkAuth: true,
    roles: [Role.Publisher, Role.Admin],
    errorElement: <Navigate to="/error" />,
    layout: <MenuSideLayout items={menusideItemBusiness} />,
  },
];
