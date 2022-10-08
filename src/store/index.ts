import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import {
  todoBoardReducer,
  todoBoardReducerName,
} from "store/todo_board/reducers";
import { todoBoardApi } from "store/todo_board/api";

export const store = configureStore({
  reducer: {
    [todoBoardReducerName]: todoBoardReducer,
    [todoBoardApi.reducerPath]: todoBoardApi.reducer,
  },
});

export type AppGetState = typeof store.getState;
export type RootState = ReturnType<AppGetState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
