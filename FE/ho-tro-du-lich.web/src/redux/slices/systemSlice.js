import { createSlice } from "@reduxjs/toolkit";

const systemSlice = createSlice({
    name: "systemSlice",
    initialState: {
        loadingState: true
    },
    reducers: {
        enableLoading: (state) => {
            state.loadingState = true;
        },
        disableLoading: (state) => {
            state.loadingState = false;
        }
    }
})

export default systemSlice.reducer;
export const systemAction = systemSlice.actions;