export type TodoType = {
  id: string;
  description: string;
};

type ColumnMetaType = {
  isLoading?: boolean;
  policy: {
    removable: boolean;
  };
};

export type ColumnType = {
  title: string;
  todos: TodoType[];
  meta: ColumnMetaType;
};

export type TodoBoardState = {
  completed: ColumnType;
  awaiting: ColumnType;
  [column: string]: ColumnType;
};
