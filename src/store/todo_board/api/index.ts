import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Data } from "pages/api/todos";
import { REDUCER_NAME } from "store/todo_board/reducers/shared";

const PAGE_LIMIT = 10;

export const todoBoardApi = createApi({
  reducerPath: `${REDUCER_NAME}Api`,
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getTodos: builder.query<Data["todos"][], { page: number }>({
      query: ({ page }) =>
        `todos?skip=${page * PAGE_LIMIT}&limit=${PAGE_LIMIT}`,
    }),
  }),
});

export const { useGetTodosQuery } = todoBoardApi;
