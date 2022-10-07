import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "store/index";
import type { ColumnsState, ColumnType, TodoType } from "store/todos/types";
import { todosApi } from "store/todos/api";

const prepareColumn = ({
  title,
  todos = [],
  meta = { isLoading: false, policy: { removable: true } },
}: Pick<ColumnType, "title"> &
  Partial<Pick<ColumnType, "todos" | "meta">>) => ({
  title,
  todos,
  meta,
});

const prepareTodo = (description: string): TodoType => ({
  id: nanoid(),
  description,
});

const initialState: ColumnsState = {
  completed: prepareColumn({
    title: "Completed todos",
    meta: { policy: { removable: false } },
  }),
  awaiting: prepareColumn({
    title: "Awaiting todos",
    meta: { policy: { removable: false } },
  }),
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<TodoType>) => {
        state.awaiting.todos.unshift(action.payload);
      },
      prepare: (description: TodoType["description"]) => ({
        payload: prepareTodo(description),
      }),
    },
    setColumnLoading: (
      state,
      action: PayloadAction<{
        columnName: keyof ColumnsState;
        loading: boolean;
      }>
    ) => {
      state[action.payload.columnName].meta.isLoading = action.payload.loading;
    },
    bulkAddTodos: {
      reducer: (state, action: PayloadAction<TodoType[]>) => {
        state.awaiting.todos.unshift(...action.payload);
      },
      prepare: (todos: { todo: TodoType["description"] }[]) => {
        return {
          payload: todos.map(({ todo }) => prepareTodo(todo)),
        };
      },
    },
    removeAllTodos: (state) => {
      Object.keys(state).forEach((column) => (state[column].todos = []));
    },
    removeTodo: (state, action: PayloadAction<Pick<TodoType, "id">>) => {
      for (const column in state) {
        state[column].todos = state[column].todos.filter(
          (todo) => todo.id !== action.payload.id
        );
      }
    },
    addTodosColumn: (state, action: PayloadAction<{ title: string }>) => ({
      ...state,
      [action.payload.title]: prepareColumn({ title: action.payload.title }),
    }),
    removeTodosColumn: (state, action: PayloadAction<{ title: string }>) => {
      delete state[action.payload.title];
    },
    todoDragEnd: (
      state,
      action: PayloadAction<{
        destination: { droppableId: string; index: number };
        source: { droppableId: string; index: number };
        id: TodoType["id"];
      }>
    ) => {
      const sourceColumnId = action.payload.source.droppableId;
      const destinationColumnId = action.payload.destination.droppableId;
      const destinationIndex = action.payload.destination.index;

      const draggable = state[sourceColumnId].todos.find(
        (todo) => todo.id === action.payload.id
      ) as TodoType;

      const filteredSourceArray = state[sourceColumnId].todos.filter(
        (todo) => todo.id !== action.payload.id
      );

      if (sourceColumnId === destinationColumnId) {
        state[sourceColumnId].todos = filteredSourceArray;
        state[sourceColumnId].todos.splice(destinationIndex, 0, draggable);
      } else {
        state[sourceColumnId].todos = filteredSourceArray;
        state[destinationColumnId].todos.splice(destinationIndex, 0, draggable);
      }
    },
  },
});

export const {
  addTodo,
  removeTodo,
  removeAllTodos,
  bulkAddTodos,
  addTodosColumn,
  removeTodosColumn,
  todoDragEnd,
  setColumnLoading,
} = todosSlice.actions;

const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fetchTodos = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setColumnLoading({ columnName: "awaiting", loading: true }));

      // Atrificial delay
      await timeout(1000);

      const { data } = await dispatch(
        todosApi.endpoints.getTodos.initiate(null)
      );

      if (data) {
        dispatch(bulkAddTodos(data));
      }

      dispatch(setColumnLoading({ columnName: "awaiting", loading: false }));
    } catch (e) {
      console.log(e);
    }
  };
};

export const todosSliceReducer = todosSlice.reducer;
export const todosSliceName = todosSlice.name;

export const selectTodos = (state: RootState) => state.todos;
export const selectTodosColumnNames = (state: RootState) =>
  Object.keys(state.todos);
