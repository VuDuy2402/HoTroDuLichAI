import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    displayLoginPrompt: false,
    isAuth: false,
    roles: [],
    infoUser: null,
  },
  reducers: {
    setAuthen: (state, action) => {
      state.isAuth = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    clearAuthen: (state) => {
      state.isAuth = false;
    },
    clearRoles: (state) => {
      state.roles = [];
    },
    activeLoginPrompt: (state) => {
      state.displayLoginPrompt = true;
    },
    deactiveLoginPrompt: (state) => {
      state.displayLoginPrompt = false;
    },
    setInfoUser: (state, action) => {
      state.infoUser = action.payload;
    },
    reset: (state) => {
      state.displayLoginPrompt = false;
      state.isAuth = false;
      state.roles = [];
      state.infoUser = null;
    },
  },
});
export default authSlice.reducer;
export const authAction = authSlice.actions;
