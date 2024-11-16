import { createSlice } from "@reduxjs/toolkit";

const systemSlice = createSlice({
  name: "systemSlice",
  initialState: {
    loadingState: true,
    noticeNumber: 0,
  },
  reducers: {
    enableLoading: (state) => {
      state.loadingState = true;
    },
    disableLoading: (state) => {
      state.loadingState = false;
    },
    addNoticeNumber: (state, action) => {
      state.noticeNumber = state.noticeNumber + action.payload;
    },
    resetNoticeNumber: (state) => {
      state.noticeNumber = 0;
    },
  },
});

export default systemSlice.reducer;
export const systemAction = systemSlice.actions;
