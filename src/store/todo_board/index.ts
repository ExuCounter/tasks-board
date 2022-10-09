import { Reducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import type { TodoBoardState } from "store/todo_board/types";
import { createColumnsReducer } from "store/todo_board/reducers/columnsReducer";
import { createTodosReducer } from "store/todo_board/reducers/todosReducer";
import { createApiReducer } from "store/todo_board/reducers/apiReducer";
import { REDUCER_NAME, prepareColumn } from "store/todo_board/utils";

const initialState: TodoBoardState = {
  columns: {
    awaiting: prepareColumn({
      title: "Awaiting todos",
      meta: { policy: { removable: false } },
    }),
    completed: prepareColumn({
      title: "Completed todos",
      meta: { policy: { removable: false, todoCompletable: false } },
    }),
  },
  api: {
    todos: {
      page: 1,
      limit: 10,
    },
  },
};

export const todoBoardReducer = reduceReducers(
  initialState,
  createColumnsReducer(initialState),
  createTodosReducer(initialState),
  createApiReducer(initialState)
) as Reducer<TodoBoardState>;

export const todoBoardReducerName = REDUCER_NAME;
