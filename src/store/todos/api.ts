import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TodoType } from "./types";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTodos: builder.query<TodoType[], null>({
      query: () => `todos`,
    }),
  }),
});

export const { useGetTodosQuery } = todosApi;
