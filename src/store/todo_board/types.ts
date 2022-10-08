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
  columns: {
    completed: ColumnType;
    awaiting: ColumnType;
    [column: string]: ColumnType;
  };
  api: {
    todos: {
      page: number;
      limit: 10;
    };
  };
};
