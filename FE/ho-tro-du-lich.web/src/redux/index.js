import { configureStore } from "@reduxjs/toolkit";
import authSlices from "./slices/authSlices";
import systemSlice from "./slices/systemSlice";
import containerCache from "./slices/containerCache";

export const store = configureStore({
  reducer: {
    authSlice: authSlices,
    systemSlice: systemSlice,
    containerCache: containerCache,
  },
});
