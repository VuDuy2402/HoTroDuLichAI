import { createSlice } from "@reduxjs/toolkit";

const signalRSlice = createSlice({
  name: "signalRSlice",
  initialState: {},
  reducers: {
    initEvent: (state, action) => {
      if (!state[action.payload.url]) {
        state[action.payload.url] = {};
        (action.payload.listEventName || []).forEach((element) => {
          state[action.payload.url][element] = null;
        });
      }
    },
    signalEvent: (state, action) => {
      const payload = action.payload;
      if (state[payload.url]) {
        state[payload.url][payload.eventName] = payload.response;
      }
    },
  },
});
export default signalRSlice.reducer;
export const signalRAction = signalRSlice.actions;
