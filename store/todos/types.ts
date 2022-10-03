export type TodoType = {
  id: string;
  todo: string;
};

type ColumnType = TodoType[];

export type State = {
  completed: ColumnType;
  awaiting: ColumnType;
  [column: string]: ColumnType;
};
