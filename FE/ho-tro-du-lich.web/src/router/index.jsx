import { store } from "../redux";
import { authService } from "../services/authServices";
import RouterProtect from "./RouterProtect";
import { routes } from "./routes";
export const renderRouter = () => {
    let routerReturn = [];
    routes.map(route => {
        routerReturn.push({
            path: route.path,
            loader: () => {
                const cacheState = store.getState();
                const { isAuth, roles } = cacheState.authSlice;
                if (isAuth && roles && roles.length > 0) {
                    return { isAuthenticated: isAuth, listRoles: roles }
                }
                return authService.getAuthAndRole();
            },
            element: <RouterProtect roles={route.roles} component={route.component} layout={route.layout} checkAuth={route.checkAuth}
            />,
            errorElement: route.errorElement
        })
    })

    return routerReturn;
}