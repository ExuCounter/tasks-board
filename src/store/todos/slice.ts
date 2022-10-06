import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "store/index";
import type { ColumnsState, TodoType } from "store/todos/types";
import { todosApi } from "store/todos/api";

const prepareColumn = ({
  title,
  todos = [],
}: {
  title: string;
  todos?: TodoType[];
}) => ({
  title,
  todos,
});

const prepareTodo = (todoMessage: string): TodoType => ({
  id: nanoid(),
  todo: todoMessage,
});

const initialState: ColumnsState = {
  completed: prepareColumn({ title: "Completed todos" }),
  awaiting: prepareColumn({ title: "Awaiting todos" }),
};

export type ColumnType = keyof ColumnsState;

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<TodoType>) => {
        state.awaiting.todos.unshift(action.payload);
      },
      prepare: (todo: TodoType["todo"]) => ({ payload: prepareTodo(todo) }),
    },
    bulkAddTodos: {
      reducer: (state, action: PayloadAction<TodoType[]>) => {
        state.awaiting.todos.unshift(...action.payload);
      },
      prepare: (todos: { todo: TodoType["todo"] }[]) => {
        return {
          payload: todos.map((todo) => prepareTodo(todo.todo)),
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
    todoDragEnd: {
      reducer: (
        state,
        action: PayloadAction<{
          destinationIndex: number;
          sourceColumnId: ColumnType;
          destinationColumnId: ColumnType;
          todoId: TodoType["id"];
        }>
      ) => {
        const draggable = state[action.payload.sourceColumnId].todos.find(
          (todo) => todo.id === action.payload.todoId
        ) as TodoType;

        const filteredSourceArray = state[
          action.payload.sourceColumnId
        ].todos.filter((todo) => todo.id !== action.payload.todoId);

        if (
          action.payload.sourceColumnId === action.payload.destinationColumnId
        ) {
          state[action.payload.sourceColumnId].todos = filteredSourceArray;
          state[action.payload.sourceColumnId].todos.splice(
            action.payload.destinationIndex,
            0,
            draggable
          );
        } else {
          state[action.payload.sourceColumnId].todos = filteredSourceArray;
          state[action.payload.destinationColumnId].todos.splice(
            action.payload.destinationIndex,
            0,
            draggable
          );
        }
      },
      prepare: ({
        destination,
        source,
        id,
      }: {
        destination: { droppableId: ColumnType; index: number };
        source: { droppableId: ColumnType; index: number };
        id: TodoType["id"];
      }) => {
        return {
          payload: {
            sourceColumnId: source.droppableId,
            destinationColumnId: destination.droppableId,
            destinationIndex: destination.index,
            todoId: id,
          },
        };
      },
    },
  },
});

export const {
  addTodo,
  removeTodo,
  removeAllTodos,
  bulkAddTodos,
  addTodosColumn,
  todoDragEnd,
} = todosSlice.actions;

export const todosSliceReducer = todosSlice.reducer;
export const todosSliceName = todosSlice.name;

export const fetchTodos = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await dispatch(
        todosApi.endpoints.getTodos.initiate(null)
      );

      if (data) {
        dispatch(bulkAddTodos(data));
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const selectTodos = (state: RootState) => state.todos;
