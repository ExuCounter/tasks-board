import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Data } from "pages/api/todos";
import { REDUCER_NAME } from "store/todo_board/reducers/shared";

export const todoBoardApi = createApi({
  reducerPath: `${REDUCER_NAME}Api`,
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTodos: builder.query<Data["todos"][], { page: number; limit: number }>({
      query: ({ page, limit }) => `todos?skip=${page * limit}&limit=${limit}`,
    }),
  }),
});

export const { useGetTodosQuery } = todoBoardApi;
