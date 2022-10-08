import { configureStore, Store } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { todoBoardReducer, todoBoardReducerName } from "store/todo_board";
import { todoBoardApi } from "store/todo_board/api";
import { createWrapper } from "next-redux-wrapper";
import type { TypedUseSelectorHook } from "react-redux";

const rootReducer = {
  [todoBoardReducerName]: todoBoardReducer,
  [todoBoardApi.reducerPath]: todoBoardApi.reducer,
};

const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(todoBoardApi.middleware),
  });
};

export const wrapper = createWrapper<Store<RootState>>(
  makeStore
  // {
  //   debug: true,
  // }
);

export type RootState = ReturnType<AppGetState>;
export type AppGetState = ReturnType<typeof makeStore>["getState"];
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
