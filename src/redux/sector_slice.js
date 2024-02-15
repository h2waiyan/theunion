import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const sectorSlice = createSlice({
  name: "sectors",
  initialState,
  reducers: {
    getSectors: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getSectors } = sectorSlice.actions;
export default sectorSlice.reducer;
