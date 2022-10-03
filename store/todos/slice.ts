import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "store/index";
import type { State, TodoType } from "store/todos/types";
import { v4 as uuidv4 } from "uuid";

const initialState: State = {
  completed: [],
  awaiting: [],
};

type ColumnType = keyof State;

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Pick<TodoType, "todo">>) => {
      state.awaiting.unshift({ todo: action.payload.todo, id: uuidv4() });
    },
    bulkAdd: (state, action: PayloadAction<Pick<TodoType, "todo">[]>) => {
      state.awaiting.unshift(
        ...action.payload.map((todo) => ({ ...todo, id: uuidv4() }))
      );
    },
    removeAll: () => initialState,
    remove: (state, action: PayloadAction<Pick<TodoType, "id">>) => {
      for (const column in state) {
        state[column as ColumnType] = state[column as ColumnType].filter(
          (todo) => todo.id !== action.payload.id
        );
      }
    },
    addColumn: (state, action: PayloadAction<{ name: string }>) => ({
      ...state,
      [action.payload.name]: [],
    }),
    dragEnd: (
      state,
      action: PayloadAction<
        Pick<TodoType, "id"> & {
          destination: { droppableId: ColumnType; index: number };
        } & {
          source: { droppableId: ColumnType; index: number };
        }
      >
    ) => {
      const sourceColumnId = action.payload.source.droppableId;
      const destinationColumnId = action.payload.destination.droppableId;

      const destinationIndex = action.payload.destination.index;

      const draggable = state[sourceColumnId].find(
        (todo) => todo.id === action.payload.id
      ) as TodoType;

      const filteredSourceArray = state[sourceColumnId].filter(
        (todo) => todo.id !== action.payload.id
      );

      if (sourceColumnId === destinationColumnId) {
        state[sourceColumnId] = filteredSourceArray;
        state[sourceColumnId].splice(destinationIndex, 0, draggable);
      } else {
        state[sourceColumnId] = filteredSourceArray;
        state[destinationColumnId].splice(destinationIndex, 0, draggable);
      }
    },
  },
});

export const selectTodos = (state: RootState) => state.todos;
