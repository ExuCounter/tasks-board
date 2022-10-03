import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import { todosSlice } from "store/todos/slice";
import { todosApi } from "store/todos/api";

export const store = configureStore({
  reducer: {
    [todosSlice.name]: todosSlice.reducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
