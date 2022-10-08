import { useEffect } from "react";
import type { NextPage } from "next";
import {
  wrapper,
  useAppDispatch,
  useAppSelector,
  AppDispatch,
  AppGetState,
} from "store/index";
import {
  removeAllTodos,
  onTodoDragEnd,
  fetchTodos,
} from "store/todo_board/reducers/todosReducer";
import {
  selectColumnsNames,
  selectColumns,
} from "store/todo_board/reducers/columnsReducer";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "components/shared/ui-kit/index";
import { CreateColumnForm } from "components/pages/@todos/forms/CreateColumnForm";
import { CreateTodoForm } from "components/pages/@todos/forms/CreateTodoForm";
import { TodoColumn } from "components/pages/@todos/TodoColumn";
import { getTodos, getRunningOperationPromises } from "store/todo_board/api";

const TodosPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const columnsNames = useAppSelector(selectColumnsNames);

  useEffect(() => {
    dispatch(fetchTodos());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="text-xl px-8 max-w-[1320px] mx-[auto] h-[100vh]">
      <div className="flex items-center justify-between h-[100px]">
        <div className="flex gap-4">
          <CreateTodoForm />
          <CreateColumnForm />
        </div>
        <div className="flex">
          <Button
            onClick={() => dispatch(fetchTodos())}
            className="mr-5"
            disabled={columns.awaiting.meta.isLoading}
          >
            Fetch random todos
          </Button>
          <Button onClick={() => dispatch(removeAllTodos())} variant="danger">
            Remove all todos
          </Button>
        </div>
      </div>
      <div className="h-[calc(100%-100px)]">
        <DragDropContext
          onDragEnd={(result) => {
            if (result.destination) {
              dispatch(
                onTodoDragEnd({
                  id: result.draggableId,
                  destination: result.destination,
                  source: result.source,
                })
              );
            }
          }}
        >
          <div className="flex gap-4 height-[100%] pb-4">
            {columnsNames.map((columnName, idx) => (
              <TodoColumn
                {...columns[columnName]}
                name={columnName}
                key={idx}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: AppGetState }) =>
    async () => {
      const state = getState();

      dispatch(
        getTodos.initiate({
          page: state.todo_board.api.todos.page,
          limit: state.todo_board.api.todos.limit,
        })
      );

      await Promise.all(getRunningOperationPromises())

      return {
        props: {},
      };
    }
);

export default TodosPage;
