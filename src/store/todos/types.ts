export type TodoType = {
  id: string;
  todo: string;
};

export type ColumnType = { title: string; todos: TodoType[] };

export type ColumnsState = {
  completed: ColumnType;
  awaiting: ColumnType;
  [column: string]: ColumnType;
};
