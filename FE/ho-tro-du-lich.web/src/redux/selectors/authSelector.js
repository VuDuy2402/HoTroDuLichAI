export const getAuthSelector = (state) => state.authSlice.isAuth;
export const getUserRoleSelector = (state) => state.authSlice.roles;
export const getUserProfileSelector = (state) => state.authSlice.infoUser;
