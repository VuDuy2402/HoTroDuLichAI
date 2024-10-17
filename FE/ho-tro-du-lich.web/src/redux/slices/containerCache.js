import { createSlice } from "@reduxjs/toolkit";

const containerCache = createSlice({
  name: "containerCache",
  initialState: {},
  reducers: {
    saveCache: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export default containerCache.reducer;
export const containerCacheAction = containerCache.actions;
