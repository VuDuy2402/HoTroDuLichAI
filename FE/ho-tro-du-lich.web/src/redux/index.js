import { configureStore } from "@reduxjs/toolkit";
import authSlices from "./slices/authSlices";
import systemSlice from "./slices/systemSlice";
import signalRSlice from "./slices/signalRSlice";
export const store = configureStore({
  reducer: {
    authSlice: authSlices,
    systemSlice: systemSlice,
    signalRSlice: signalRSlice,
  },
});
