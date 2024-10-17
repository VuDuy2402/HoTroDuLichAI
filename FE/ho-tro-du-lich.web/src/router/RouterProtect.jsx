import React, { useEffect, useState } from "react";
import {
  Navigate,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { authService } from "../services/authServices";
import { authAction } from "../redux/slices/authSlices";
import PromptLoading from "../common/components/PromptLoading/PromptLoading";
import { systemAction } from "../redux/slices/systemSlice";

const RouterProtect = ({ component, roles, layout, checkAuth }) => {
  const [allow, setAllow] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated, listRoles } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(systemAction.enableLoading());
    const checkPermission = () => {
      if (roles && roles.length === 0) {
        if (!checkAuth || (checkAuth && isAuthenticated)) {
          return true;
        }
      } else if (
        roles &&
        listRoles.some((role) => roles.includes(role)) &&
        isAuthenticated
      ) {
        if (!checkAuth || (checkAuth && isAuthenticated)) {
          return true;
        }
      }
      return false;
    };
    if (
      isAuthenticated &&
      (location.pathname === "/dangnhap" || location.pathname === "dangky")
    ) {
      navigate("/");
    }
    const result = checkPermission();
    setAllow(result);
    if (isAuthenticated && listRoles && listRoles.length > 0) {
      dispatch(authAction.setAuthen(isAuthenticated));
      dispatch(authAction.setRoles(listRoles));
    }
    dispatch(systemAction.disableLoading());
  }, [component, roles]);
  const attachComponent = layout
    ? React.cloneElement(layout, {
        children: component,
      })
    : component;

  return (
    <>
      {allow == null && <PromptLoading />}
      {allow && attachComponent}
      {allow === false && <Navigate to="/dangnhap" />}
    </>
  );
};

export default RouterProtect;
