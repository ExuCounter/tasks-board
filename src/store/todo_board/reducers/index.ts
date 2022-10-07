import type { TodoBoardState, ColumnType } from "store/todo_board/types";
import { createColumnsReducer } from "store/todo_board/reducers/columnsReducer";
import { createTodosReducer } from "store/todo_board/reducers/todosReducer";
import { REDUCER_NAME, prepareColumn } from "store/todo_board/reducers/shared";
import { Reducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";

const initialState: TodoBoardState = {
  completed: prepareColumn({
    title: "Completed todos",
    meta: { policy: { removable: false } },
  }),
  awaiting: prepareColumn({
    title: "Awaiting todos",
    meta: { policy: { removable: false } },
  }),
};

export const todoBoardReducer = reduceReducers(
  initialState,
  createColumnsReducer(initialState),
  createTodosReducer(initialState)
) as Reducer<TodoBoardState>;

export const todoBoardReducerName = REDUCER_NAME;
