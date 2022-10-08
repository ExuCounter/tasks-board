import { createAction, createReducer } from "@reduxjs/toolkit";
import { getActionName, prepareColumn } from "store/todo_board/utils";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TodoBoardState } from "store/todo_board/types";
import type { RootState } from "store/index";

const createActions = (actions: ReturnType<typeof createAction>[]) => {
  return actions;
};

export const setColumnLoading = createAction<{
  columnName: keyof TodoBoardState["columns"];
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
        state.columns[action.payload.columnName].meta.isLoading =
          action.payload.loading;
      })
      .addCase(
        addTodosColumn,
        (state, action: PayloadAction<{ title: string }>) => {
          state.columns[action.payload.title] = prepareColumn({
            title: action.payload.title,
          });
        }
      )
      .addCase(
        removeTodosColumn,
        (state, action: PayloadAction<{ title: string }>) => {
          delete state.columns[action.payload.title];
        }
      );
  });

export const selectColumns = (state: RootState) => state.todo_board.columns;
export const selectColumnsNames = (state: RootState) =>
  Object.keys(state.todo_board.columns);
