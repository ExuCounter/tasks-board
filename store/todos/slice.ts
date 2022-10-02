import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "store/index";
import type { State, TodoType } from "store/todos/types";
import { v4 as uuidv4 } from "uuid";

const initialState: State = [];

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ name: string }>) => [
      ...state,
      { name: action.payload.name, id: uuidv4() },
    ],
    remove: (state, action: PayloadAction<{ id: string }>) =>
      state.filter((todo) => todo.id !== action.payload.id),
    dragEnd: (state, action: PayloadAction<{ id: string; index: number }>) => {
      const draggable = state.find(
        (todo) => todo.id === action.payload.id
      ) as TodoType;

      const filteredArray = state.filter(
        (todo) => todo.id !== action.payload.id
      );

      return [
        ...filteredArray.slice(0, action.payload.index),
        draggable,
        ...filteredArray.slice(action.payload.index),
      ];
    },
  },
});

export const selectTodos = (state: RootState) => state.todos;
