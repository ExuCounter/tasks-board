import type { ColumnType } from "store/todo_board/types";

export const REDUCER_NAME = "todo_board";
export const getActionName = (type: string) => `${REDUCER_NAME}/${type}`;

export const prepareColumn = ({
  title,
  meta,
  todos = [],
}: Pick<ColumnType, "title"> & Partial<Pick<ColumnType, "todos" | "meta">>) => {
  const defaultMeta = { isLoading: false, policy: { removable: true } };

  return {
    title,
    todos,
    meta: { ...defaultMeta, ...meta },
  };
};
