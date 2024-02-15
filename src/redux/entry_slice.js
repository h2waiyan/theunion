import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "",
};

const entrySlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    getUsers: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getUsers } = entrySlice.actions;
export default entrySlice.reducer;
