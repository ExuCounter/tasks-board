import { createAction, createReducer, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "store/index";
import type { TodoBoardState, TodoType } from "store/todo_board/types";
import { todoBoardApi } from "store/todo_board/api";
import { timeout } from "components/shared/utils/timeout";
import { setColumnLoading } from "store/todo_board/reducers/columnsReducer";
import { getActionName } from "store/todo_board/reducers/shared";

const prepareTodo = (description: string): TodoType => ({
  id: nanoid(),
  description,
});

export const addTodo = createAction(
  getActionName("addTodo"),
  (description: TodoType["description"]) => ({
    payload: prepareTodo(description),
  })
);

export const bulkAddTodos = createAction(
  getActionName("todos/bulkAddTodos"),
  (todos: { todo: TodoType["description"] }[]) => {
    return {
      payload: todos.map(({ todo }) => prepareTodo(todo)),
    };
  }
);

export const removeAllTodos = createAction(getActionName("removeAllTodos"));

export const removeTodo = createAction<Pick<TodoType, "id">>(
  getActionName("removeTodo")
);

export const onTodoDragEnd = createAction<{
  destination: { droppableId: string; index: number };
  source: { droppableId: string; index: number };
  id: TodoType["id"];
}>(getActionName("onTodoDragEnd"));

export const createTodosReducer = (state: TodoBoardState) =>
  createReducer(state, (builder) => {
    builder
      .addCase(addTodo, (state, action: PayloadAction<TodoType>) => {
        state.awaiting.todos.unshift(action.payload);
      })
      .addCase(bulkAddTodos, (state, action: PayloadAction<TodoType[]>) => {
        state.awaiting.todos.unshift(...action.payload);
      })
      .addCase(removeAllTodos, (state) => {
        Object.keys(state).forEach((column) => (state[column].todos = []));
      })
      .addCase(removeTodo, (state, action) => {
        for (const column in state) {
          state[column].todos = state[column].todos.filter(
            (todo) => todo.id !== action.payload.id
          );
        }
      })
      .addCase(onTodoDragEnd, (state, action) => {
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
          state[destinationColumnId].todos.splice(
            destinationIndex,
            0,
            draggable
          );
        }
      });
  });

export const fetchTodos = () => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(setColumnLoading({ columnName: "awaiting", loading: true }));

      // Atrificial delay
      await timeout(1000);

      const { data } = await dispatch(
        todoBoardApi.endpoints.getTodos.initiate({ page: 1 })
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

export const selectTodos = (state: RootState) => state.todo_board;
