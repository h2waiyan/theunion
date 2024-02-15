import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import entrySlice from "./entry_slice.js";
import sectorSlice from "./sector_slice.js";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    entries: entrySlice,
    sectors: sectorSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(api.middleware);
  },
});
