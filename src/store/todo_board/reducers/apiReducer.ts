import { createAction, createReducer } from "@reduxjs/toolkit";
import type { TodoBoardState } from "store/todo_board/types";
import { getActionName } from "store/todo_board/reducers/shared";

export const updateTodosQueryVariables = createAction<{
  page: number;
}>(getActionName("updateTodosQueryVariables"));

export const createApiReducer = (state: TodoBoardState) =>
  createReducer(state, (builder) => {
    builder.addCase(updateTodosQueryVariables, (state, action) => {
      state.api.todos.page = action.payload.page;
    });
  });
