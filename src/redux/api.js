import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getUsers } from "./entry_slice";
import { getSectors } from "./sector_slice";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sectors.htoowaiyan.me/api/v1/",
  }),
  endpoints: (builder) => ({
    getSectors: builder.query({
      query: () => ({
        url: "sector",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            getSectors({
              sectors: result.data.data,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    getEntries: builder.query({
      query: () => ({
        url: "entry",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result);
          dispatch(
            getUsers({
              entries: result.data.finalList,
            })
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    addEntry: builder.mutation({
      query: (body) => ({
        url: "entry",
        method: "POST",
        body,
      }),
    }),
    editEntry: builder.mutation({
      query: (body) => ({
        url: "entry",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetSectorsQuery,
  useGetEntriesQuery,
  useAddEntryMutation,
  useEditEntryMutation,
} = api;
