import { createAction, createReducer, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, AppGetState } from "store/index";
import type { TodoBoardState, TodoType } from "store/todo_board/types";
import { todoBoardApi } from "store/todo_board/api";
import { setColumnLoading } from "store/todo_board/reducers/columnsReducer";
import { getActionName } from "store/todo_board/utils";
import { updateTodosQueryVariables } from "store/todo_board/reducers/apiReducer";

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

export const completeTodo = createAction<Pick<TodoType, "id">>(
  getActionName("completeTodo")
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
        state.columns.awaiting.todos.unshift(action.payload);
      })
      .addCase(bulkAddTodos, (state, action: PayloadAction<TodoType[]>) => {
        state.columns.awaiting.todos.unshift(...action.payload);
      })
      .addCase(removeAllTodos, (state) => {
        state.api.todos.page = 1;

        Object.keys(state.columns).forEach(
          (column) => (state.columns[column].todos = [])
        );
      })
      .addCase(completeTodo, (state, action) => {
        const completedTodos: TodoType[] = [];

        for (const column in state.columns) {
          state.columns[column].todos = state.columns[column].todos.filter(
            (todo) => {
              if (todo.id === action.payload.id) {
                completedTodos.push(todo);
              }

              return todo.id !== action.payload.id;
            }
          );
        }

        state.columns.completed.todos.unshift(...completedTodos);
      })
      .addCase(removeTodo, (state, action) => {
        for (const column in state.columns) {
          state.columns[column].todos = state.columns[column].todos.filter(
            (todo) => todo.id !== action.payload.id
          );
        }
      })
      .addCase(onTodoDragEnd, (state, action) => {
        const sourceColumnId = action.payload.source.droppableId;
        const destinationColumnId = action.payload.destination.droppableId;
        const destinationIndex = action.payload.destination.index;

        const draggable = state.columns[sourceColumnId].todos.find(
          (todo) => todo.id === action.payload.id
        ) as TodoType;

        const filteredSourceArray = state.columns[sourceColumnId].todos.filter(
          (todo) => todo.id !== action.payload.id
        );

        if (sourceColumnId === destinationColumnId) {
          state.columns[sourceColumnId].todos = filteredSourceArray;
          state.columns[sourceColumnId].todos.splice(
            destinationIndex,
            0,
            draggable
          );
        } else {
          state.columns[sourceColumnId].todos = filteredSourceArray;
          state.columns[destinationColumnId].todos.splice(
            destinationIndex,
            0,
            draggable
          );
        }
      });
  });

export const fetchTodos = () => {
  return async (dispatch: AppDispatch, getState: AppGetState) => {
    const state = getState();
    const page = state.todo_board.api.todos.page;
    const limit = state.todo_board.api.todos.limit;

    try {
      dispatch(setColumnLoading({ columnName: "awaiting", loading: true }));

      const { data } = await dispatch(
        todoBoardApi.endpoints.getTodos.initiate({
          page,
          limit,
        })
      );

      if (data) {
        const nextPage = page + 1;

        dispatch(bulkAddTodos(data));
        dispatch(updateTodosQueryVariables({ page: nextPage }));
      }

      dispatch(setColumnLoading({ columnName: "awaiting", loading: false }));
    } catch (e) {
      dispatch(setColumnLoading({ columnName: "awaiting", loading: false }));
      console.log(e);
    }
  };
};
