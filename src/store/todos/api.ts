import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type FetchedTodoType = { id: string; todo: string };

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTodos: builder.query<FetchedTodoType[], null>({
      query: () => `todos`,
    }),
  }),
});

export const { useGetTodosQuery } = todosApi;
