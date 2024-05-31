import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (newUser) => ({
        url: "/auth/login",
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
