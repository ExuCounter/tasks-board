import { createAction, createReducer } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TodoBoardState } from "store/todo_board/types";
import type { RootState } from "store/index";
import { getActionName, prepareColumn } from "store/todo_board/reducers/shared";

export const setColumnLoading = createAction<{
  columnName: keyof TodoBoardState;
  loading: boolean;
}>(getActionName("setColumnLoading"));

export const addTodosColumn = createAction<{ title: string }>(
  getActionName("addTodosColumn")
);

export const removeTodosColumn = createAction<{ title: string }>(
  getActionName("removeTodosColumn")
);

export const createColumnsReducer = (state: TodoBoardState) =>
  createReducer(state, (builder) => {
    builder
      .addCase(setColumnLoading, (state, action) => {
        state[action.payload.columnName].meta.isLoading =
          action.payload.loading;
      })
      .addCase(
        addTodosColumn,
        (state, action: PayloadAction<{ title: string }>) => ({
          ...state,
          [action.payload.title]: prepareColumn({
            title: action.payload.title,
          }),
        })
      )
      .addCase(
        removeTodosColumn,
        (state, action: PayloadAction<{ title: string }>) => {
          delete state[action.payload.title];
        }
      );
  });

export const selectColumnNames = (state: RootState) =>
  Object.keys(state.todo_board);
